const jwt = require('jsonwebtoken')

const createToken = (user, secret, expiresIn) => {
    const { username, email } = user
    return jwt.sign({ username, email }, secret, { expiresIn })
}

module.exports = {
    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            const allRecipes = await Recipe.find()
            return allRecipes
        }
    },
    Mutation: {
        addRecipe: async (root, args, { Recipe }) => {
            const newRecipe = await new Recipe({ ...args.input }).save()
            return newRecipe
        },

        signupUser: async (root, args, { User }) => {
            const { username, email, password } = args.input
            const user = await User.findOne({ username })
            if (user) {
                throw new Error('User already exists')
            }
            const newUser = await new User({ username, email, password }).save()
            return { token: createToken(newUser, process.env.SECRET, '1hr') }
        }
    }
}