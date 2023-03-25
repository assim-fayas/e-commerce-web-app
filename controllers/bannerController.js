const loadbanner=async(req,res)=>{
try {
    res.render('banner')
} catch (error) {
    console.log(error.message);
}

}





module.exports={
    loadbanner
}