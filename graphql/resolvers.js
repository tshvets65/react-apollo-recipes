const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createToken = (user, secret, expiresIn) => {
    const { username, email } = user
    return jwt.sign({ username, email }, secret, { expiresIn })
}

module.exports = {
    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            const allRecipes = await Recipe.find().sort({ createdAt: 'desc' })
            return allRecipes
        },
        getUserRecipes: async (root, { user }, { Recipe }) => {
            const userRecipes = await Recipe.find({ author: user }).sort({ createdAt: 'desc' })
            return userRecipes
        },
        getCurrentUser: async (root, args, { currentUser, User }) => {
            if (!currentUser) return null
            const user = User.findOne({ username: currentUser.username })
                .populate({
                    path: 'favorites',
                    model: 'Recipe'
                })
            return user
        },
        getRecipe: async (root, { _id }, { Recipe }) => {
            const recipe = await Recipe.findById(_id).populate('author')
            return recipe
        },
        searchRecipes: async (root, { searchTerm }, { Recipe }) => {
            if (searchTerm) {
                const searchResults = await Recipe.find({
                    $text: { $search: searchTerm }
                }, {
                        score: { $meta: 'textScore' }
                    }).sort({
                        score: { $meta: 'textScore' }
                    })
                return searchResults
            } else {
                const allRecipes = await Recipe.find().sort({ likes: 'desc', createdAt: 'desc' })
                return allRecipes
            }
        }
    },
    Mutation: {
        addRecipe: async (root, args, { Recipe }) => {
            const newRecipe = await new Recipe({ ...args.input }).save()
            return newRecipe
        },

        deleteUserRecipe: async (root, { _id }, { Recipe }) => {
            const recipe = await Recipe.findOneAndRemove({ _id })
            return recipe
        },

        addRecipeToFavorites: async (root, { recipeId, userId }, { User, Recipe }) => {
            const recipe = await Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { likes: 1 } })
            const user = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { favorites: recipeId } })
            return recipe
        },

        removeRecipeFromFavorites: async (root, { recipeId, userId }, { User, Recipe }) => {
            const recipe = await Recipe.findOneAndUpdate({ _id: recipeId }, { $inc: { likes: -1 } })
            const user = await User.findOneAndUpdate({ _id: userId }, { $pull: { favorites: recipeId } })
            return recipe
        },

        signupUser: async (root, args, { User }) => {
            const { username, email, password } = args.input
            const user = await User.findOne({ username })
            if (user) {
                throw new Error('User already exists')
            }
            const newUser = await new User({ username, email, password }).save()
            return { token: createToken(newUser, process.env.SECRET, '1hr') }

        },

        signinUser: async (root, args, { User }) => {
            const { username, password } = args.input
            const user = await User.findOne({ username })
            if (!user) {
                throw new Error('User not found')
            }
            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                throw new Error('Invalid password!')
            }
            return { token: createToken(user, process.env.SECRET, '1hr') }
        }
    }
}