module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "Posseder", {
            nombre: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true
            },

        });
}