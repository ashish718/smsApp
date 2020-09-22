import React, { useCallback, useState } from 'react';
import { Card, FormLayout, InlineError, Stack, TextField } from '@shopify/polaris';

export default function Separ() {
	const [ textFieldValue, setTextFieldValue ] = useState('');

	const handleTextFieldValueChange = useCallback((value) => setTextFieldValue(value), []);

	const textFieldID = 'ruleContent';
	const isInvalid = isValueInvalid(textFieldValue);
	const errorMessage = isInvalid ? 'Enter 6 or more characters for product type is equal to' : '';

	const formGroupMarkup = (
		<Stack wrap={false} alignment='leading' spacing='loose'>
			<Stack.Item fill>
				<FormLayout>
					<FormLayout.Group condensed>
						<TextField
							labelHidden
							label='Collection rule content'
							error={isInvalid}
							id={textFieldID}
							value={textFieldValue}
							onChange={handleTextFieldValueChange}
							multiline
						/>
					</FormLayout.Group>
				</FormLayout>
				<div style={{ marginTop: '4px' }}>
					<InlineError message={errorMessage} fieldID={textFieldID} />
				</div>
			</Stack.Item>
		</Stack>
	);

	return (
		<Card sectioned>
			<FormLayout>{formGroupMarkup}</FormLayout>
		</Card>
	);

	function isValueInvalid(content) {
		if (!content) {
			return true;
		}

		return content.length < 6;
	}
}
