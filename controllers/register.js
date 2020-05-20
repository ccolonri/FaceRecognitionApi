
const handleRegister = (req, res, db, bcrypt) => {
    const {
        email,
        name,
        password
    } = req.body
    if(!email || !name || !password){
       return  res.status(400).json('Incorrect form submission');
    }
    // Hash the password
    const hash = bcrypt.hashSync(password);
    // transaction is used here to make  changes in two tables and be consistent, if an error occurs transaction is cancelled. 
    db.transaction(trx => {
            trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return db('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                            joined: new Date()
                        }).then(user => {
                            res.json(user[0])
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
}