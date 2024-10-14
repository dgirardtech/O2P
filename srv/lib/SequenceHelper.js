const LOG = cds.log('KupitO2PSrv');

module.exports = class SequenceHelper {
	constructor (options) {
		this.db = options.db;
		this.sequence = options.sequence;
	}

    resetSequence() {
		return new Promise((resolve, reject) => {
			let nextNumber = 0;
			 
            this.db.run(`ALTER SEQUENCE "${this.sequence}" RESTART WITH 1`)
                .then(result => {
                })
                .catch(error => {
                    LOG.error(error.text)
                    reject(error);
                });	 
		});

    }

	getNextNumber() {
		return new Promise((resolve, reject) => {
			let nextNumber = 0;
			 
            this.db.run(`SELECT "${this.sequence}".NEXTVAL FROM DUMMY`)
                .then(result => {
                    nextNumber = result[0][`${this.sequence}.NEXTVAL`];
                    resolve(nextNumber);
                })
                .catch(error => {
                    LOG.error(error.text)
                    reject(error);
                });	 
		});
	}
};