import axios from 'axios';
import bcrypt from 'bcrypt';

export default function routes(db){

    async function home(req,res){
        const data = await axios.get('https://shoe-api-xpy7.onrender.com/api/shoes')
                    .then (function (response) {
                        // handle success
                        return response.data
                       })
          res.render("index",{
                shoes : data
            })
    }
    
    async function signingUp(req,res){
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = {
                username : req.body.username,
                email : req.body.email,
                user_password : hashedPassword,
                
            } 

            const registering = await axios.post(`https://shoe-api-xpy7.onrender.com/users`, user)
                                            .then(function(result){
                                                result.data 
                                            })
                                            registering
                                            
                                            res.render('login',{message : 'Successfully registered'})
        } catch (error) {
            console.log(error)
        }

    }
    // Route for logging in 
    async function login(req,res){
        try {
            const userName = req.body.usernamel
            const passWord = req.body.password
            
            const userEncryptedPassword = await axios.get(`https://shoe-api-xpy7.onrender.com/api/user/${userName}`)
                                                     .then(function(result){
                                                        return result.data.getHashedPassword.user_password
                                                     })

            const  isUserExisting = await axios.post(`https://shoe-api-xpy7.onrender.com/users/user`,userName)
                                                .then(function(result){
                                                    return result.data
                                                })
            console.log(userName, userEncryptedPassword)

            const passwordMatch = await bcrypt.compare(passWord, userEncryptedPassword)
            console.log(passwordMatch)

            if(isUserExisting && passwordMatch){
                

                const orderCode = await axios.get(`http://shoe-api-xpy7.onrender.com/api/order-cart/create?username=${userName}`)
                                             .then(function(result){
                                                return result.data.orderCode
                                             })
                orderCode
                res.redirect('/')
            }else{
                res.render('login',{message: 'Incorect username or password'})
            }
            

        } catch (error) {
            console.log(error)
        }
    }

     async function filterAll(req, res){
        try {
            const shoe_sizes = req.body.size
            const shoe_colors = req.body.color
            const shoe_brands = req.body.brand


            if (shoe_sizes && shoe_brands && shoe_colors){
                const allFilters = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/brand/${shoe_brands}/size/${shoe_sizes}/color/${shoe_colors}`)
                                              .then((result)=>{
                                                return result.data
                                              })
                                            
                                              res.render("index",{allFilters})
            }
            else if (shoe_sizes !== '' && shoe_brands !== ''){
                const sizeAndBrand = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/brand/${shoe_brands}/size/${shoe_sizes}`)
                                                .then(function(result){
                                                    console.log(result.data)
                                                    return result.data
                                                    
                                                })
                                                res.render('index',{sizeAndBrand})
            }
            else if(shoe_brands && shoe_sizes === ''  && shoe_colors === '' ){
                const brands = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/brand/${shoe_brands}`)
                                        .then(function (response){
                                            
                                        return response.data
                                    })
                                    res.render('index',{brands})
            }
            else if(shoe_sizes && shoe_colors === '' && shoe_brands === ''){
                const sizes = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/size/${shoe_sizes}`)
                                        .then(function (response){
                                        return response.data
                                    })
                                    res.render('index',{sizes})

            }
            else if(shoe_colors  && shoe_sizes === '' && shoe_brands === '' ){
                const color = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/color/${shoe_colors}`)
                                        .then(function(result){
                                            return result.data
                                        })
                                        res.render("index",{color}) 
            }
            
             
        } catch (error) {
            console.log(error)
        }
     }


    async function shoeSpecs(req,res){
        try {

            const userName = req.body.usernamel
            const shoenamer = req.params.shoe
          
            const shoeSpec = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/shoe/${shoenamer}`)
                                        .then(function(result){

                                            return result.data
                                        })
                                        res.render("shoe",{shoeSpec})
        } catch (error) {
            console.log(error)
        }

    }

    async function femaleShoes (req,res){
        try {
        
            const femaleShoes = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/gender/Women`)
                                            .then(function (result){
                                                return result.data
                                            })
                                            res.render('women',{femaleShoes})
        } catch (error) {
            console.log(error)
            
        }
    }

    async function maleShoes(req,res){
        try {
            const maleShoes = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/gender/Men`)
                                         .then((result)=>{
                                            return result.data
                                         })
                                         res.render('men',{maleShoes})            
        } catch (error) {
            console.log(error)
        }
    }

    async function getShoesById(req,res){
        try {
            const idOfShoe = req.params.shoeid

            const shoeaded = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/${idOfShoe}`)
                                        .then((response)=>{
                                            return response.data.shoeInCart
                                        })
                                        return shoeaded
                                        
        } catch (error) {
            console.log(error)
        }
    } 
    async function addShoeAdmin(req,res){
        try {
            const { shoename,color, brand, price, size, stock, image_url, gender, size_url } = req.body;
            
            console.log(shoename,color, brand, price, size, stock, image_url, gender, size_url)
            // Create an object to represent the shoe
            const shoe = {
                shoename,
                color,
                brand,
                price,
                size,
                stock,
                image_url,
                gender,
                size_url
            };

            const adminAdd = await axios.post(`http://shoe-api-xpy7.onrender.com/api/shoes`,shoe)
                                        .then(function(result){
                                            result.data
                                        }) 
            adminAdd
            res.render('admin',{messgage:'Shoe added successfully'})

        } catch (error) {
            console.log(error)
        }
        
    }
    async function addToCart(req,res){
        try {
            const userNAme = req.body.usernamel
            const idOfShoe = req.params.shoeid

            const shoeOrder ={
                userNAme,
                idOfShoe
            } 

            const oderedShoe = await axios.post(`https://shoe-api-xpy7.onrender.com/order`,shoeOrder)
                                        .then(function(result){
                                            return result.data
                                        })                

            oderedShoe
            res.redirect('cart')
        } catch (error) {
            console.log(error)
        }
    }
    async function getCartItems(req,res){
        try {
            const cart = await axios.get(`https://shoe-api-xpy7.onrender.com/order`)
                                     .then(function(result){
                                        return result.data
                                     })
                                     res.render('cart',{cart})
        } catch (error) {
            console.log(error)
        }
    }

    return{
        home,
        signingUp,
        filterAll,
        shoeSpecs,
        femaleShoes,
        maleShoes,
        getShoesById,
        addShoeAdmin,
        addToCart,
        getCartItems,
        login
       
    }
} 