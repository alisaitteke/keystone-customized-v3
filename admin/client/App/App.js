/**
 * The App component is the component that is rendered around all views, and
 * contains common things like navigation, footer, etc.
 */

import React, { Component } from 'react';
import { Container } from './elemental';
import { Link } from 'react-router';
import { css } from 'glamor';

import MobileNavigation from './components/Navigation/Mobile';
import PrimaryNavigation from './components/Navigation/Primary';
import SecondaryNavigation from './components/Navigation/Secondary';
import Footer from './components/Footer';
import axios from "axios";


const classes = {
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	body: {
		flexGrow: 1,
	},
};

class App extends Component {

	constructor(){
		super();

		this.state ={
			isLoading:true
		}

	}
	
	componentDidMount(){

		axios.post('/api/getusertype', { token: 'Adana01', user_id: Keystone.user.id }).then(response => {

			Keystone['userAuthorization']= response.data.type;
			
			this.setState(
				{
					isLoading:false
				}
			);
		}).catch(error => {
			console.log(` Axios request failed: ${error}`);
			this.setState(
				{
					isLoading:false
				}
			);
		});
	}

	render()
	{
		if(this.state.isLoading===false){
		
		const listsByPath = require('../utils/lists').listsByPath;

		let children = this.props.children;
		// If we're on either a list or an item view
		let currentList, currentSection;
		if (this.props.params.listId) {
			currentList = listsByPath[this.props.params.listId];
			// If we're on a list path that doesn't exist (e.g. /keystone/gibberishasfw34afsd) this will
			// be undefined
			if (!currentList) {
				children = (
					<Container>
						<p>List not found!</p>
						<Link to={`${Keystone.adminPath}`}>
							Go back home
						</Link>
					</Container>
				);
			} else {
				// Get the current section we're in for the navigation
				currentSection = Keystone.nav.by.list[currentList.key];
			}
		}
		// Default current section key to dashboard
		const currentSectionKey = (currentSection && currentSection.key) || 'dashboard';
		return (
			<div className={css(classes.wrapper)}>
				<header>
					<MobileNavigation
						User={Keystone.User}
						user={Keystone.user}
						brand={Keystone.brand}
						currentListKey={this.props.params.listId}
						currentSectionKey={currentSectionKey}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl}
					/>
					<PrimaryNavigation
						User={Keystone.User}
						user={Keystone.user}
						currentSectionKey={currentSectionKey}
						brand={Keystone.brand}
						sections={Keystone.nav.sections}
						signoutUrl={Keystone.signoutUrl}
					/>
					{/* If a section is open currently, show the secondary nav */}
					{(currentSection) ? (
						<SecondaryNavigation
							User={Keystone.User}
							user={Keystone.user}
							currentListKey={this.props.params.listId}
							lists={currentSection.lists}
							itemId={this.props.params.itemId}
						/>
					) : null}
				</header>
				<main User={Keystone.User}
							user={Keystone.user} className={css(classes.body)}>
					{children}
				</main>
				<Footer
					appversion={Keystone.appversion}
					backUrl={Keystone.backUrl}
					brand={Keystone.brand}
					User={Keystone.User}
					user={Keystone.user}
					version={Keystone.version}
				/>
			</div>
		);
		}else{

			return <div> Page is loading please wait.</div>;
			
		}
	}			
};

module.exports = App;
