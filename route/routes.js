import axios from 'axios';

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

    async function filterBrand(req,res){
        try {
            const brandTag = req.body.brand
            console.log(brandTag)

            if(brandTag){
               const brands = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/brand/${brandTag}`)
                                        .then(function (response){
                                            
                                        return response.data
                                    })
                                    res.render("index",{brands})
            }
            else{
                res.redirect('/')
            }

        } catch (error) {
                    console.log(error)
        }
            
            
    }

    async function filterSize(req, res){
        try {
            const shoe_size = req.body.size

            if(shoe_size){
                const sizes = await axios.get( `https://shoe-api-xpy7.onrender.com/api/shoes/size/${shoe_size}`)
                                        .then(function (response){
                                        return response.data
                                    })
                                    res.render("index",{sizes})
            }
            else{
                res.redirect('/')
            }
        } catch (error) {
            
        }
    }

    async function filterBrandSize(req,res){
        try {
            const brandMenu = req.body.brand
            const shoe_sizes = req.body.size
            if(brandMenu && shoe_sizes){
                const filtered = await axios.get(`https://shoe-api-xpy7.onrender.com/api/shoes/brand/${brandMenu}/size/${shoe_sizes}`)
                                            .then(function (result){
                                                return result.data
                                            })
                                            res.render("index",{filtered})
            }
        } catch (error) {
            
        }
    }

    return{
        home,
        filterBrand,
        filterSize,
        filterBrandSize
       
    }
} 