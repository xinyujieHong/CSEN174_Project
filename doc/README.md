# 数据库使用指南 (Database Usage Guide)

本文档详细说明了 CampusPool 项目中双数据库模式（内存模式与 MySQL 模式）的配置、切换及数据管理方法。

## 1. 简介

本项目为了方便开发和生产环境部署，设计了抽象的数据存储层，支持两种运行模式：

*   **内存模式 (Memory Mode)**: 数据存储在服务器内存中。
    *   **优点**: 无需安装外部数据库，启动快，适合开发调试和演示。
    *   **缺点**: 服务重启后数据会丢失，不支持持久化。
*   **MySQL 模式**: 数据存储在 MySQL 数据库中。
    *   **优点**: 数据持久化保存，支持高并发，适合生产环境。
    *   **缺点**: 需要安装和配置 MySQL 服务。

## 2. 配置说明

所有配置均通过 `src/backend/.env` 文件进行管理。如果该文件不存在，请复制 `.env.example` 创建。

### 2.1 核心配置项

| 变量名 | 说明 | 可选值 | 默认值 |
| :--- | :--- | :--- | :--- |
| `STORAGE_MODE` | 数据存储模式 | `memory`, `mysql` | `memory` |

### 2.2 MySQL 相关配置

当 `STORAGE_MODE=mysql` 时，以下配置生效且必填：

| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `DB_HOST` | 数据库主机地址 | `127.0.0.1` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_USER` | 数据库用户名 | `root` |
| `DB_PASSWORD` | 数据库密码 | `your_password` |
| `DB_NAME` | 数据库名称 | `campuspool_db` |
| `DB_CONNECTION_LIMIT`| 连接池最大连接数 | `10` |

## 3. 模式切换指南

### 3.1 场景一：从内存模式切换到 MySQL 模式

1.  **准备数据库环境**:
    *   确保 MySQL 服务已启动。
    *   登录 MySQL 并创建数据库：
        ```sql
        CREATE DATABASE campuspool_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        ```
    *   **初始化表结构**:
        使用 MySQL 客户端工具（如 Workbench, DBeaver）或命令行，运行项目中的初始化脚本：
        `src/backend/database/init.sql`

2.  **修改配置**:
    打开 `src/backend/.env` 文件，修改如下配置：
    ```ini
    STORAGE_MODE=mysql
    DB_HOST=你的数据库IP
    DB_PORT=3306
    DB_USER=你的用户名
    DB_PASSWORD=你的密码
    DB_NAME=campuspool_db
    ```

3.  **重启服务**:
    在终端中重启后端服务以应用更改：
    ```bash
    # 停止当前服务 (Ctrl+C)
    # 重新启动
    npm run dev
    ```
    *观察控制台输出，如果看到 "MySQLDataStore initialized" 字样，说明连接成功。*

### 3.2 场景二：从 MySQL 模式切换回内存模式

1.  **修改配置**:
    打开 `src/backend/.env` 文件，将存储模式改回 memory：
    ```ini
    STORAGE_MODE=memory
    ```
    *(注：切换回内存模式时，MySQL 相关的配置会被忽略，无需删除)*

2.  **重启服务**:
    ```bash
    npm run dev
    ```
    *观察控制台输出，如果看到 "Initializing DataStore in 'memory' mode..." 字样，说明切换成功。*

## 4. 数据清除与重置

### 4.1 内存模式 (Memory)
*   **清除方法**: 直接重启后端服务。
*   **原理**: 内存中的 JavaScript 对象在进程结束时会被释放，重启后会重新初始化为空对象。

### 4.2 MySQL 模式
由于数据已持久化到硬盘，重启服务**不会**清除数据。如需清空数据，请选择以下任一方法：

#### 方法 A：重置整个数据库（推荐开发环境使用）
最彻底的方法是删除数据库并重新创建。
```sql
DROP DATABASE campuspool_db;
CREATE DATABASE campuspool_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 然后重新运行 src/backend/database/init.sql 中的建表语句
```

#### 方法 B：清空所有表数据（保留表结构）
如果只想清空数据但保留表结构，可按顺序执行以下 SQL（注意外键约束顺序）：
```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE conversations;
TRUNCATE TABLE carpool_requests;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
```

## 5. 常见问题排查

*   **错误：`Error: connect ECONNREFUSED`**
    *   原因：无法连接到 MySQL 服务器。
    *   解决：检查 `DB_HOST` 和 `DB_PORT` 是否正确，确认 MySQL 服务是否已启动。

*   **错误：`ER_BAD_DB_ERROR`**
    *   原因：数据库不存在。
    *   解决：请先手动执行 `CREATE DATABASE campuspool_db;`。

*   **错误：`ER_NO_SUCH_TABLE`**
    *   原因：表不存在。
    *   解决：请确保已运行 `src/backend/database/init.sql` 初始化表结构。

*   **数据未保存？**
    *   检查当前模式是否为 `memory`。内存模式下重启即丢失。
