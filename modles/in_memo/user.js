class User {
    constructor(params) {
        if(!params.name || !params.age) throw new Error("age and name required when new a user");
        this.name = params.name;
        this.age = params.age;
    }
}

module.exports = User;
