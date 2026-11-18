# 🚀 统一安装入口

[← 返回合集首页](../README.md)

本合集目前有 1 个 Skill，可以安装到 Codex 或 Muse。

| Skill | 用途 | 调用名称 |
| --- | --- | --- |
| 万能裂变海报生成器 | 配置驱动的 Canvas 海报引擎，新年求签等模板一键复制 | `$viral-poster-generator` |

## 1. 获取合集

```bash
git clone https://github.com/717986230/ptoh.git
cd ptoh
```

## 2. 选择要安装的 Skill

先查看可选项：

```bash
python3 scripts/install_skills.py --list
```

安装全部：

```bash
python3 scripts/install_skills.py --all
```

或者只安装这一个：

```bash
python3 scripts/install_skills.py --skill viral-poster-generator
```

默认安装到 `~/.codex/skills/`。Muse 用户也可以指定：

```bash
python3 scripts/install_skills.py --all --destination ~/workspace/custom-skills
```

**已有同名 Skill 时，安装器会停止，不会覆盖原文件。** 如果需要替换已有版本，请先备份并移走原目录，再运行安装命令。

## 3. 开始使用

开始新的对话，输入 `$viral-poster-generator`，再说你想做的玩法，比如“做一个新年求签模板”或“把打工人模板改成教师节版”。

- [海报生成器示例与使用教程](viral-poster-generator.md)
- [复制 1000 次的流水线](replication-1000.md)
- [效果测试记录](testing.md)
