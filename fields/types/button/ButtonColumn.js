import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import { Button } from "../../../admin/client/App/elemental";
import ConfirmationDialog from '../../../admin/client/App/shared/ConfirmationDialog';
import axios from "axios";

var ButtonColumn = React.createClass({
	displayName: 'ButtonColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
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
	getValue() {
		// cropping text is important for textarea, which uses this column
		const value = this.props.data.fields[this.props.col.path];
		return value ? value.substr(0, 100) : null;
	},
	getAction() {

		const { action } = this.props.col.field;

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
	getId() {
		return this.props.data.id;
	},
	renderConfirmDialog() {
		const { action } = this.props.col.field;

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
	toggleConfirmDialog() {
		this.setState({
			state_confirm: !this.state.state_confirm,
		});
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
	render() {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
		return (
			<ItemsTableCell>
				{this.renderAlertDialog()}
				{this.renderConfirmDialog()}
				<ItemsTableValue className={className} to={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
					<Button size="small" type="button" data-button-type="button" color='primary' block={true}
						style={{ textTransform: 'capitalize' }} onClick={this.toggleConfirmDialog}>
						{this.props.col.label.toString().split('_').join(' ').toUpperCase()}
					</Button>
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = ButtonColumn;
