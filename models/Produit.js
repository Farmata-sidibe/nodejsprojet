// exporte table with all field
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "produit", {
            // field name
            id: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey = true
                primaryKey: true,
                // set autoIncrement = true
                autoIncrement: true
            },
            Status: {
                //set data type with max length
                type: Sequelize.DataTypes.BOOLEAN,
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true
            },
            stock: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER(5),
            },
            nom: {
                //set data type with out max length
                type: Sequelize.DataTypes.STRING(255),
            },
            ref: {
                //set data type with out max length
                type: Sequelize.DataTypes.STRING(75),
            },
            prix: {
                //set data type with out max length
                type: Sequelize.DataTypes.DECIMAL(7, 2),
            },
            designation: {
                //set data type with out max length
                type: Sequelize.DataTypes.TEXT,
            },
            composition: {
                //set data type with out max length
                type: Sequelize.DataTypes.TEXT,
            },
            conseilUtilisation: {
                //set data type with out max length
                type: Sequelize.DataTypes.TEXT,
            },
            noterproduit: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER(11),
            },
            image: {
                //set data type with out max length
                type: Sequelize.DataTypes.TEXT,
            }


        }, {
            /**
             * By default, Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
             */
            timestamps: true,
            /**
             * Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
             * This also applies to foreign keys generated by associations.
             * */

            underscored: true,
        }
    );
};