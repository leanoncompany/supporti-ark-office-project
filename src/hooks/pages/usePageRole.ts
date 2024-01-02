import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type usePageRoleReturnType = {
	pageRole: string;
	pid: string | string[] | undefined;
};

const usePageRole = (): usePageRoleReturnType => {
	//* Modules
	const router = useRouter();

	//* States
	const { pid } = router.query;
	const [pageRole, setPageRole] = useState<string>('');

	useEffect(() => {
		if (pid !== undefined) {
			if (pid == 'write') {
				setPageRole('write');
			} else {
				setPageRole('edit');
			}
		}
	}, [pid]);

	return { pageRole, pid };
};

export default usePageRole;
