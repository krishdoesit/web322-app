const Sequelize = require('sequelize');

var sequelize = new Sequelize('ihvopojk', 'ihvopojk', 'd3twPp2TQ1at4wseeZDd3YsnubGkpZ92', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, { foreignKey: 'category' });

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(resolve('Database Synced Successfully'))
            .catch(reject('unable to sync database'));
    })
};

exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(resolve(Post.findAll()))
            .catch(reject("no results returned"));
    })
};


exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        })
            .then(resolve(Post.findAll({ where: { published: true } })))
            .catch(reject("no results returned"));
    })
};

exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll()
            .then(data => { resolve(data); })
            .catch(err => { reject("no results returned"); })
    })
};

exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        
        for (var i in postData) {
            if (postData[i] == "") {
                postData[i] = null;
            }            
        }
        postData.published = (postData.published) ? true : false;
        postData.postDate=new Date();

        Post.create(postData)
            .then(resolve(Post.findAll()))
            .catch(reject("Unable to create Post"));
    })
};

exports.getPostsByCategory = (postcatId) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: postcatId
            }
        })
        .then(resolve(Post.findAll({ where: { category: postcatId } })))
        .catch(reject("no results returned"));
    })
};

exports.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        reject();
    });

}

exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        })
            .then(data => resolve(data[0]))
            .catch(reject("no results returned"));
    })
};

exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        })
            .then(resolve(Post.findAll({ where: { published: true, category: category } })))
            .catch(reject("no results returned"));
    })
};

exports.addCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        for (var i in categoryData) {
            if (categoryData[i] == "") {
                categoryData[i] = null;
            }
        }

        Category.create(categoryData)
            .then(resolve(Category.findAll()))
            .catch(reject("unable to create category"))
    })
};

exports.deleteCategoryById = id => {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        })
            .then(resolve())
            .catch(reject("unable to delete category"))
    })
};

exports.deletePostById = id => {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        })
            .then(resolve())
            .catch(reject("Unable to delete Post"))
    })
};


exports.getPostsByMinDate = () => {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        })
            .then(data => resolve(data))
            .catch(reject("no results returned"))

    })
}


