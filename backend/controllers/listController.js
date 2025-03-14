const List = require('../models/List');


// Create a new list
const createList = async (req, res) => {
    const { name } = req.body;

    try {
        const exitingList = await List.findOne({ name });
        if (exitingList) {
            return res.status(400).json({ msg: "List with this name already exists" });
        }

        const newList = new List({ name });
        await newList.save();

        res.status(201).json({ msg: 'List created successfully', list: newList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', err: err.message });
    }
}


// Get all lists
const getAllLists = async (req, res) => {
    try {
        const lists = await List.find();
        res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Get a single list by ID
const getListById = async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }
        res.status(200).json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Update a list
const updateList = async (req, res) => {
    const { name } = req.body;

    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }

        // Update list fields
        if (name) list.name = name;
        list.updatedAt = Date.now();

        // Save the updated list
        await list.save();

        res.status(200).json({ msg: 'List updated successfully', list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Delete a list by ID
const deleteList = async (req, res) => {
    try {
        const list = await List.findByIdAndDelete(req.params.id);
        
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }

        res.status(200).json({ msg: 'List deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};



module.exports = {
    createList,
    getAllLists,
    getListById,
    updateList,
    deleteList
}