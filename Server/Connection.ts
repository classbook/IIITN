import {User, Task, KeyValue} from 'Server/Database/IIITN';
import {getResponseID} from 'Common/Utils';
import {INR_User} from 'Common/ActionSignature';
import {ITaskAction, ITaskActionType} from 'App/State/Reducers/TaskReducer';
export type IRequestType = 
	"REGISTER" | "STUDENTS" | "PROFILE"
	| keyof(INR_User) | ITaskActionType
	| "KEYVALUE_GET" | "KEYVALUE_SET"

export interface IRequest {
	id: number
	type: IRequestType
	data: any
}
export interface IResponse {
	error?: string
	data?: any
}

export class Connection {
	socket: SocketIO.Socket;
	user: User;

	constructor(socket: SocketIO.Socket) {
		this.socket = socket;
		this.initialize();
	}

	processRequest(request: IRequest) {
		switch(request.type) {
			case "USER_LOGIN": {
				return User.login(request.data).then((data: any)=>{
					this.user = data.ref;
					return {secretKey: data.secretKey};
				});
			}
			case "REGISTER": {
				return User.register(request.data);
			}
			case "STUDENTS": {
				return User.getStudents();
			}
			case "PROFILE": {
				return User.getProfile(request.data.userid);
			}
			case "TASK_ACTION": {
				return Task.performAction(request.data);
			}
		}
		if (!this.user) {
			return Promise.reject("User should be authenticated first.");
		}
		switch(request.type) {
			// Authenticated actions goes here...
		}
		// Admin actions goes here...
		if (this.user.userid=="admin") {
			switch(request.type) {
				case "KEYVALUE_SET": {
					return KeyValue.set(request.data.key, request.data.value);
				}
				case "KEYVALUE_GET": {
					return KeyValue.get(request.data.key);
				}
			}
		}
		return Promise.reject(`Request type ${request.type} not found.`);
	}

	initialize() {
		this.socket.on('request', (request: IRequest)=>{
			// Process request and send response in data.
			this.processRequest(request).then((data: any)=>{
				let response: IResponse = {
					data
				};
				this.socket.emit(getResponseID(request.id), response);	
			}).catch((error: any)=>{
				let response: IResponse = {
					error
				};
				this.socket.emit(getResponseID(request.id), response)
			});
		});
	}
}