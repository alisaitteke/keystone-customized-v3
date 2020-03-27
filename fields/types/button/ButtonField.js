import Field from '../Field';
import React from 'react';
import { Button, FormInput } from "../../../admin/client/App/elemental";
import ConfirmationDialog from '../../../admin/client/App/shared/ConfirmationDialog';
import axios from "axios";


module.exports = Field.create({
	displayName: 'ButtonField',
	statics: {
		type: 'Button',
	},
	getInitialState() {
		return {
			loading: false,
			state_confirm: false,
			alert_dialog: {
				isOpen: false,
				type: 'success',
				title: ''
			}

		};
	},
	getId() {
		return this.props.values.transaction_id;
	},
	getValue() {
		return this.props.value;
	},
	getAction() {

		const { action } = this.props;

		if (action === 'open_url') {
			const value = this.getValue();
			window.open(value, "_blank");

			this.setState({
				state_confirm: !this.state.state_confirm,
			});
		}
		else if (action === 'resend_ipn') {

			this.toggleConfirmDialog();


			axios.post('/api/resend_ipn_manually', { token: 'Adana01', id: this.getId() }).then(response => {
				console.log(' Returned data:', response);
				this.toogleAlertDiaglog('success', (<p>IPN of this transaction has been re-sent <strong>successfully</strong>?</p>));
			}).catch(error => {
				console.log(` Axios request failed: ${error}`);
				this.toogleAlertDiaglog('danger', (<p>IPN of this transaction can not be re-sent <strong>EROR: {error}</strong>?</p>));
			});

		}
	},
	renderConfirmDialog() {
		const { action } = this.props;

		let confirmation_text = <p>Are you sure ?</p>;
		if (action === 'resend_ipn') {
			confirmation_text = <p>Are you sure to <strong>re-send the ipn</strong>?</p>
		}
		else if (action === 'open_url') {
			const value = this.getValue();
			confirmation_text = <p>Are you sure to <strong>re-direct to {value}</strong>?</p>
		}

		return (
			<ConfirmationDialog
				confirmationLabel="Confirm"
				isOpen={this.state.state_confirm}
				onCancel={this.toggleConfirmDialog}
				onConfirmation={this.getAction}>
				{confirmation_text}
			</ConfirmationDialog>
		)
	},
	renderAlertDialog() {

		return (
			<ConfirmationDialog
				confirmationLabel="OK"
				confirmationType={this.state.alert_dialog.type}
				isOpen={this.state.alert_dialog.isOpen}
				onConfirmation={() => this.toogleAlertDiaglog('success', '')}>
				{this.state.alert_dialog.title}
			</ConfirmationDialog>
		)
	},
	toogleAlertDiaglog(type, title) {
		this.setState({
			alert_dialog: {
				isOpen: !this.state.alert_dialog.isOpen,
				type: type,
				title: title
			}
		});
	},
	toggleConfirmDialog() {
		this.setState({
			state_confirm: !this.state.state_confirm,
		});
	},

	renderField() {
		const { action } = this.props;
		let inputText = null;
		let button = null;

		if (action === 'open_url') {
			inputText = (<FormInput
				name={this.getInputName(this.props.path)}
				ref="focusTarget"
				value={this.props.value}
				onChange={this.valueChanged}
				autoComplete="off"
				type="text"
			/>);
		}
		if (this.getValue() !== '') {
			button = (<Button size="small" type="button" data-button-type="button" color='primary' block={true}
				style={{ textTransform: 'capitalize', width: '200px', marginTop: '5px' }} onClick={this.toggleConfirmDialog} >
				{this.props.label.toString().split('_').join(' ').toUpperCase()}
			</Button>);
		}
		return (
			<div>
				{this.renderAlertDialog()}
				{this.renderConfirmDialog()}
				{inputText}
				{button}
			</div>
		);
	},

	renderValue() {
		return (
			<div>
				{this.renderAlertDialog()}
				{this.renderConfirmDialog()}
				<Button size="small" type="button" data-button-type="button" color='primary' block={true}
					style={{ textTransform: 'capitalize', width: '200px' }} onClick={this.toggleConfirmDialog}>
					{this.props.label.toString().split('_').join(' ').toUpperCase()}
				</Button>
			</div>
		);
	}
});
