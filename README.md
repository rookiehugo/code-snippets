**Code-Snippets**
=======================


## How to use 

### 1. install dependencies:


    sudo apt-get install mysql-server-5.5


### 2. Create Test Data

    sudo npm i -g mocha
    mocha test/test-data-create.js


### 3. Add SnippetType

Do not forget modify config.json(max_snippet_type_id)


## Models

### User

```
id              char(32)        not null   pk
email           varchar(255)    not null   unique
password        varchar(255)    not null
name            varchar(255)    not null
slogan          text
admin_type      int             not null   fk
```

### UserType

```
id              int             not null   pk
typeName        varchar(255)    not null
```

### CodeSnippet

```
id              char(32)        not null   pk
title           varchar(255)    not null
snippet         text            not null
is_deleted      boolean         not null
user_id         varchar(255)    not null   fk
type_id         int             not null   fk
```

### SnippetType

```
id              int             not null   pk
typeName        varchar(255)    not null
routerName      varchar(255)    not null
modeName        varchar(255)    not null
```

### UserRelation

```
id              int             not null   pk autoIncrement
user_id         char(32)        not null   fk
follow_id       char(32)        not null   fk
```

### FavoriteSnippet

```
id              int             not null   pk autoIncrement
user_id         char(32)        not null   fk
snippet_id      char(32)        not null   fk
```