import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {Header} from './_presentation/Header';
import {History_} from './_presentation/History';
import {RouteComponent} from './_presentation/RouteComponent';
import {GetState, IRootState, __store} from './State';
import {Me} from 'App/MyActions';
import {ServiceWorker} from 'App/Network/ServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {Provider, connect} from 'react-redux';
import { Network } from 'App/Network';

ServiceWorker.initialize();

Network.registerConnected(()=>{
	Me.goOnline();
	// Attempt login here :)
	if (GetState().user.userid) {
		// Reestablish session if user is already logged in.
		Me.login({
			userid: GetState().user.userid as string,
			secretKey: GetState().user.secretKey as string
		});
	}
});
Network.registerDisconnected(()=>{
	Me.goOffline();
});
Network._on("PASSIVE_ACTION", (data: any)=>{
	__store.dispatch(data);
});

interface IProps {
	isOffline: boolean
};
let _App = (props: IProps)=>{
	return <BrowserRouter>
		<ClassUI contentWidth={1200} offline={props.isOffline}>
			<History_ />
			<Header />
			<Content>
			<RouteComponent />
			</Content>
		</ClassUI>
	</BrowserRouter>;
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		isOffline: !state.user.online
	}
};

export let App = connect(mapStateToProps)(_App);