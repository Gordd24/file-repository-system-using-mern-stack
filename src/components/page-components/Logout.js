const logout = function(event) {
    event.preventDefault()
        if(window.confirm("Do you want to logout?")===true){
            console.log('signed out')
            window.location.href = '/'
        }else{
            console.log('cancelled')
        }
    }
    
    export default logout;