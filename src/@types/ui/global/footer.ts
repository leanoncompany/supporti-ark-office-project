//* Import libraries
import { BoxProps } from '@mui/material';

interface IFooterProps {
	// Terms links
	terms?: {
		[key: string]: {
			link: string;
			label: string;
		};
	};

	// Basic informations
	information?: {
		ceo?: { label: string; value: string };
		companyRegistrationNumber?: { label: string; value: string };
		contactNumber?: { label: string; value: string };
		contactAvailableTime?: { label: string; value: string };
		address?: { label: string; value: string };
		email?: { label: string; value: string };
		license?: { label: string; value: string };
	};

	// Copyright
	copyright?: {
		foundingYear: number;
		name: string;
	};

	// Contact
	contact?: {
		number?: string;
		availableTime?: string;
		additionalInfoOfAvailableTime?: string;
	};

	// Wrapper props
	wrapperBoxProps?: BoxProps;
}

export default IFooterProps;
