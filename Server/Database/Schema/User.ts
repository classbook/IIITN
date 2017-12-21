import {IJSONSchema} from 'classui/Components/Form/Schema';

export let S_User: IJSONSchema = {
	type: "object",
	properties: {
		_id: {
			type: "string",
			pattern: "(^N\\d{6}$)|(admin)"
		},
		name: {
			type: "string"
		},
		email: {
			type: "string",
			format: "email"
		},
		password: {
			type: "string",
			minLength: 5
		},
		batch: {
			enum: ["E1", "E2", "E3", "E4"]
		},
		branch: {
			enum: ["CSE", "MME", "ECE", "MECH", "CHEMICAL"]
		},
		role: {
			enum: ["admin", "student"]
		}
	},
	required: ["_id", "email", "password", "batch", "branch"]
};

export let S_UserLogin: IJSONSchema = {
	type: "object",
	properties: {
		userid: (S_User.properties as any)._id,
		password: (S_User.properties as any).password	
	},
	required: ["userid", "password"]
};