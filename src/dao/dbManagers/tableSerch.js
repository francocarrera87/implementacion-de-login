const itemModel = require ('../models/item')

class tableSerch {

    async addItem(item){
       await itemModel.create(item);
    }

    async getItems(page, limit){
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 5
        };
        const items = await itemModel.paginate({}, options);
        return items;
    }

    async getItem(id){
        const items= await itemModel.find({_id: id}).lean()
        return items[0];
    }
        
    async updateItem(id, newItem){
        await itemModel.updateOne({_id : id}, newItem)
    }

    async deleteItem(id){
        await itemModel.deleteOne({_id: id})
    }

    async searchItems(query, page, limit){
        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 5
        };
        const items = await itemModel.paginate({ nombre: { $regex: query, $options: 'i' } }, options);
        return items;
    }
    
}

module.exports = tableSerch; 
