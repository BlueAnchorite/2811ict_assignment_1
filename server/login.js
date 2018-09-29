// ============================================
// This module handles the login according to
// the data that is presented.
// ============================================

module.exports = function(){
    this.data;

    this.findUser = function(user){
        let match = false;
        let users = this.data.users;
        for(let i = 0; i < users.length; i++){
            if(users[i].username == user.username && users[i].password == user.password){
                match = users[i];
            }
        }
        return match;
    };

    this.setUserData = function(data){
        this.data = data;
    };

    return this;
};