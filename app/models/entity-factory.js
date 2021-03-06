var Sequelize = require("sequelize");
var path = require('path');
var config = require('../../config.json')
var sequelize;
var nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
    sequelize = new Sequelize(config.database, config.db_user, config.db_pwd, {
        host: 'localhost',
        port: 3306,
        logging: false,
        // pool: {
        //     maxConnections: 100,
        //     minConnections: 20,
        //     maxIdleTime: 3600
        // },
        define: {
            freezeTableName: true,
            underscored: true
        }
    });
} else {
    sequelize = new Sequelize(null, null, null, {
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../data/code-snippets.db'),
        logging: false,
        define: {
            freezeTableName: true,
            underscored: true,
            timestaps: false,
            charset: 'utf8'
        }
    });
}

var User = sequelize.define('user', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
    },
    name: {
        allowNull: false,
        type: Sequelize.STRING
    },
    password: {
        allowNull: false,
        type: Sequelize.STRING
    },
    slogan: {
        allowNull: true,
        type: Sequelize.TEXT
    },
    admin_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1
    }
});

var UserType = sequelize.define('userType', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    typeName: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

var CodeSnippet = sequelize.define('codeSnippet', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    snippet: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

var SnippetType = sequelize.define('snippetType', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    typeName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    routerName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    modeName: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

var UserRelation = sequelize.define('userRelation', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    follow_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

var FavoriteSnippet = sequelize.define('favoriteSnippet', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    snippet_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.hasMany(CodeSnippet, {
    foreignKey: 'user_id'
});

CodeSnippet.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

SnippetType.hasMany(CodeSnippet, {
    foreignKey: 'type_id'
});

CodeSnippet.belongsTo(SnippetType, {
    as: 'typer',
    foreignKey: 'type_id'
});

UserType.hasMany(User, {
    foreignKey: 'admin_type'
});

User.belongsTo(UserType, {
    as: 'typer',
    foreignKey: 'admin_type'
});

User.hasMany(UserRelation, {
    foreignKey: 'user_id'
});

UserRelation.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

User.hasMany(UserRelation, {
    foreignKey: 'follow_id'
});

UserRelation.belongsTo(User, {
    as: 'follow',
    foreignKey: 'follow_id'
});

User.hasMany(FavoriteSnippet, {
    foreignKey: 'user_id'
});

FavoriteSnippet.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id'
});

CodeSnippet.hasMany(FavoriteSnippet, {
    foreignKey: 'snippet_id'
});

FavoriteSnippet.belongsTo(CodeSnippet, {
    as: 'snippet',
    foreignKey: 'snippet_id'
});

sequelize.sync({
    force: false
}).success(function() {
    User.count().success(function(total) {
        if (total < 1) {
            var initAdmin = require('../init/init-admin');
        }
    });
    SnippetType.count().success(function(total) {
        if (total < 1) {
            var initType = require('../init/init-snippet-type');
        }
    });
    UserType.count().success(function(total) {
        if (total < 1) {
            var initType = require('../init/init-user-type');
        }
    });
}).error(function(err) {
    console.log(err);
});

module.exports = {
    User: User,
    UserType: UserType,
    CodeSnippet: CodeSnippet,
    SnippetType: SnippetType,
    UserRelation: UserRelation,
    FavoriteSnippet: FavoriteSnippet,
    sequelize: function() {
        return sequelize;
    }
};