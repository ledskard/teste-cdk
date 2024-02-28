import { Stack, StackProps, aws_ecs as ecs, aws_ec2 as ec2, aws_ecr as ecr, aws_elasticloadbalancingv2 as elbv2, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class TesteCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const cluster = new ecs.Cluster(this, 'MyCluster', { vpc });

    const repository = ecr.Repository.fromRepositoryName(this, 'MyRepository', 'teste-cdk');

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    const container = taskDefinition.addContainer('WebContainer', {
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
