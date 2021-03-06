import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Select} from 'classui/Components/Form/Select';
import {S_User} from 'Server/Database/Schema';
import {Flash} from 'classui/Components/Flash';
import {Me} from 'App/MyActions';
import {RequireAuthentication} from './Login';
import {RouteComponentProps, Link, Redirect} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};

export let Register = ()=> {
	Flash.flash((dismiss)=>{
		return <RegisterComponent />;
	}, false, false, true);
}

class RegisterComponent extends React.Component<any, {error: string, registered: boolean}>{
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			error: "",
			registered: false
		};
	}
	register(data: any) {
		Me.register(data).then(
			(data)=>{
				this.setState({registered: true});
			},
			(error)=>{
				this.setState({error});
			})
	}
	render() {
		if (this.state.registered) {
			RequireAuthentication({
				message: "User Successfully Registered."
			});
			return null;
		}
		return <div style={{minWidth: 230}}>
			<div className="button" onClick={()=>RequireAuthentication()}>Login here.</div>
			<Formlayout style={{width: 270}} schema={S_User} label="Register" onSubmit={this.register.bind(this)}>
			{this.state.error?<h5 style={{color: "red"}}>{this.state.error}</h5>:null}
				<TextField autoFocus name="_id" label="University ID">University ID</TextField>
				<TextField name="name" label="Name">Name</TextField>
				<TextField name="email" label="Email ID">Email</TextField>
				<TextField type="password" name="password" label="Password">Password</TextField>
				Batch : <Select name="batch" nonEditable options={(S_User.properties as any).batch.enum}></Select>
				Branch : <Select name="branch" top nonEditable options={(S_User.properties as any).branch.enum}></Select>
				<input type="submit"/>
			</Formlayout>
		</div>;
	}
}