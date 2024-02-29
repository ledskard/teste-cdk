import { Stack, StackProps, aws_ecs as ecs, aws_ec2 as ec2, aws_ecr as ecr, aws_elasticloadbalancingv2 as elbv2, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class TesteCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'MinhaVPC', {
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });
    const cluster = new ecs.Cluster(this, 'frontend-cluster', { vpc });
    const repository = ecr.Repository.fromRepositoryName(this, 'frontend-repository', 'teste-cdk');
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,

    });
    const container = taskDefinition.addContainer('frontend-next', {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'v2.0'),
      portMappings: [{ containerPort: 3000 }],
    });
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
    });
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc,
      internetFacing: true,
    });
    const listener = alb.addListener('Listener', {
      port: 80,
    });
    listener.addTargets('ECS', {
      port: 80,
      targets: [service.loadBalancerTarget({
        containerName: 'WebContainer',
        containerPort: 3000,
      })],
    });
    new CfnOutput(this, 'ALBDNS', { value: alb.loadBalancerDnsName });
  }
}