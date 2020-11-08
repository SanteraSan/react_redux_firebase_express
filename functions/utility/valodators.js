const isEmail = (email) =>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)){
        return true
    }else{
        return false
    }
};

const isEmpty = (checkString) => {
    return checkString.trim() === "";
};

exports.validateSignupData = (newUser =>{
    let errors = {};
    if(isEmpty(newUser.email)){
        errors.email = 'Поле должно быть заполненно'
    }else if(!isEmail(newUser.email)){
        errors.email = "Введите корректный адрем почты"
    }
    if (isEmpty(newUser.password)){
        errors.password = 'Поле должно быть заполненно'
    }
    if (newUser.password !== newUser.confirmPassword){
        errors.password = 'Пароли должны совпадать'
    }
    if (isEmpty(newUser.handle)){
        errors.handle = 'Поле должно быть заполненно'
    }


    return {
        errors,
        valid: Object.keys(errors).length === 0
    }

});

exports.validateLoginData = (data) =>{
    let errors = {};
    if (isEmpty(data.email)){
        errors.email = 'Поле должно быть заполненно'
    }
    if (isEmpty(data.password)){
        errors.password = 'Поле должно быть заполненно'
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }

};

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if (!isEmpty(data.website.trim())) {
        // https://website.com
        if (data.website.trim().substring(0, 4) !== 'http') {
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }
    if (!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};