import { css } from 'glamor';
import React, { PropTypes } from 'react';
import theme from '../../../../theme';

import ListSort from './ListSort';

function ListHeaderTitle ({
	activeSort,
	availableColumns,
	handleSortSelect,
	title,
	amountSum,
	...props
}) {
	
	console.log(amountSum);

	let totalAmount = null;

	if(amountSum[0]!=null){
		totalAmount = <span style={{fontSize:"15px"}}><br/>Total Approved Amount is <b style={{color:"#1385e5"}}>{amountSum[0].totalAmount}</b> TL.</span>
	}
	
	return (
		<h2 className={css(classes.heading)} {...props}>

			
			{title} 
			<ListSort
				activeSort={activeSort}
				availableColumns={availableColumns}
				handleSortSelect={handleSortSelect}
			/>
			{totalAmount}

		</h2>
	);
};

ListHeaderTitle.propTypes = {
	activeSort: PropTypes.object,
	availableColumns: PropTypes.arrayOf(PropTypes.object),
	handleSortSelect: PropTypes.func.isRequired,
	title: PropTypes.string,
};

const classes = {
	heading: {
		[`@media (max-width: ${theme.breakpoint.mobileMax})`]: {
			fontSize: '1.25em',
			fontWeight: 500,
		},
	},
};

module.exports = ListHeaderTitle;
