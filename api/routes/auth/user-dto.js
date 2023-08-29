module.exports = class EmployeeDTO {
	id;
	email;
	name;
	create;
	off;

	constructor(model) {
		this.id = model._id;
		this.email = model.email;
		this.off = model.off;
		this.name = model.name;
		this.create = model.create;
	}
};
