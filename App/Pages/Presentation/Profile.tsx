import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {User} from '../../User';

interface IProps {
	userid: string
};
interface IState {
	profile: any
};

export class Profile extends React.Component<IProps, IState> {
	constructor() {
		super();
		this.state = {
			profile: null
		};
	}
	componentDidMount() {
		User.getProfile(this.props.userid).then((profile)=>{
			console.log(profile);
			this.setState({
				profile
			});
		}).catch((error)=>{
			console.error(error);
		});
	}
	render() {
		let {profile} = this.state;
		if (!profile) {
			return null;
		}
		return <Layout gutter={20} justify="center">
			<Section width={600} card>
				<h4>{profile.name}</h4>
				<h5>Class : {profile.batch}-{profile.branch}</h5>
				<h5>Learning Progress : 50%</h5>
			</Section>
		</Layout>;
	}
};