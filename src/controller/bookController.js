const BooksModel = require("../modules/BooksModel");
const UserModel = require("../modules/UserModel");


const {
    isValidRequestBody,
    isEmpty,
    isValidObjectId,
    isValidDate,
    isValidDateFormat,
    isValidISBN
} = require("../utility/validation")

const createBook = async (req, res) => {
    try {
        const data = req.body;

        if (!isValidRequestBody(data)) return res.status(400).send({
            status: false,
            message: "Body Empty"
        })

        const {
            title,
            ISBN,
            releasedAt,
            category,
            userId,
            subcategory,
            reviews,
            excerpt
        } = data;

        if (isEmpty(releasedAt)) return res.status(400).send({
            status: false,
            message: "Released Date is required"
        })

        if (!isValidDateFormat(releasedAt)) return res.status(400).send({
            status: false,
            message: "Date must be in the format YYYY-MM-DD"
        })

        if (!isValidDate(releasedAt)) return res.status(400).send({
            status: false,
            message: "Invalid Date"
        })

        if (isEmpty(excerpt)) return res.status(400).send({
            status: false,
            message: "Excerpt is required"
        })


        if (isEmpty(category)) return res.status(400).send({
            status: false,
            message: "Category required"
        })

        if (isEmpty(userId)) return res.status(400).send({
            status: false,
            message: "UserId required"
        })
        if (!isValidObjectId(userId)) return res.status(400).send({
            status: false,
            message: "UserId invalid"
        })

        if (isEmpty(subcategory)) return res.status(400).send({
            status: false,
            message: "Subcategory required"
        })

        if (isEmpty(title)) return res.status(400).send({
            status: false,
            message: "Title required"
        })


        if (isEmpty(ISBN)) return res.status(400).send({
            status: false,
            message: "ISBN required"
        })

        if (!isValidISBN(ISBN)) return res.status(400).send({
            status: false,
            message: "ISBN must be number"
        })
        


        // DB Calls

        const isIdExist = await UserModel.findOne({
            _id: userId
        }).catch(e => null);
        if (!isIdExist) return res.status(404).send({
            status: false,
            message: "User Id does not exist"
        })

        const isTitleUnique = await BooksModel.findOne({
            title
        }).catch(e => null);
        if (isTitleUnique) return res.status(400).send({
            status: false,
            message: "Title already exist"
        })

        const isISBNUnique = await BooksModel.findOne({
            ISBN
        }).catch(e => null);
        if (isISBNUnique) return res.status(400).send({
            status: false,
            message: "ISBN already exist"
        })

        const createBook = await BooksModel.create({
            title,
            ISBN,
            releasedAt : new Date(releasedAt),
            category,
            userId,
            subcategory,
            reviews,
            excerpt
        })

        return res.status(201).send({ status : true, message: "Book created successfully", data : createBook})

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { 
    createBook 
};

