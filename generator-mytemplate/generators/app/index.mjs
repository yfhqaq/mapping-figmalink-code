import Generator from 'yeoman-generator';
import path from 'path';

export default class extends Generator {
  async prompting() {
    this.answers = {};

    const projectAnswers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: 'SptTable' // Default project name
      }
    ]);

    this.answers.projectName = projectAnswers.projectName;
  }

  async writing() {
    const targetDir = this.destinationPath(this.answers.projectName);

    // 定义文件和目录结构
    const templates = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'src/internal/ModuleConfigForm/ButtonConfig/index.tsx',
      'src/internal/ModuleConfigForm/EventConfig/index.tsx',
      'src/internal/ModuleConfigForm/ModalForm.tsx',
      'src/internal/ModuleFunctional/index.tsx',
      'src/model/generator.ts',
      'src/model/preSave.ts',
      'src/model/schema.ts',
      'src/model/validator.ts',
      'src/moduleInfo/index.tsx',
      'src/rollup/index.ts',
      'src/rollup/rollup-index.ts',
      'src/rollup/standardModule.ts'
    ];

    for (const template of templates) {
      const filePath = path.join(targetDir, template);
      
      // 提示用户输入参数
      const answers = await this.prompt([
        {
          type: 'input',
          name: 'arg',
          message: `Please provide input for ${template}`
        }
      ]);

      const content = `这是我拼接后的结果${answers.arg}`;
      
      this.fs.write(this.destinationPath(filePath), content);
    }
  }

  install() {
    const targetDir = this.destinationPath(this.answers.projectName);
    this.spawnCommand('npm', ['install'], { cwd: targetDir });
  }
}
