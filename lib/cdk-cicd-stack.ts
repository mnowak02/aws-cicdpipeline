import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';


export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'AwesomePipeline', {
      pipelineName: 'AwesomePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('mnowak02/aws-cicdpipeline', 'cicd-practice'),
        commands: [
          'npm ci',
          'npx cdk synth',
          'echo exampletext',
          'ls -al',
          'pwd'
        ],
      })

    });
    const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage',{
      stageName:'test1'
    }))
    const testStage2 = pipeline.addWave('PipelineTestStage2',{
      pre: [
        new ManualApprovalStep('approval needed',{
          comment: "prove it or not"
        })
      ]
      
    })


  }
}
