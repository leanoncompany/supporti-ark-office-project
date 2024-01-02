import { Box, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AuthController from '../../controller/default/AuthController';
import useCheckLogin from '../../hooks/data/useCheckLogin';

export type IProfileProps = {
	width?: number;
	getProfileCallback?: (
		setProfile: React.Dispatch<React.SetStateAction<string | undefined>>
	) => void;
};

const Profile = (props: IProfileProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [profile, setProfile] = useState<string>();
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const { isLogin } = useCheckLogin();

	useEffect(() => {
		if (isLogin === true) {
			if (props.getProfileCallback !== undefined) {
				props.getProfileCallback(setProfile);
			} else {
				const controller = new AuthController();

				controller.getProfile(
					(res: any) => {
						setProfile(res.data.result.USER_NAME);
					},
					(err: any) => {
						console.log(err);
					}
				);
			}
		}
	}, [isLogin]);

	return (
		<Box>
			<Tooltip title="Profile">
				<Box
					onClick={handleClick}
					display={'flex'}
					flexDirection={'column'}
					aria-controls={open ? 'alarm' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					sx={{ cursor: 'pointer' }}
				>
					<Box>
						<Typography variant={'h6'} fontWeight={'500'}>
							{profile}
						</Typography>
					</Box>
				</Box>
			</Tooltip>

			{/* <Menu
				anchorEl={anchorEl}
				id="alarm"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						border: '1px solid silver',
						borderRadius: '10px',
						mt: 0.3,
						height: 'auto',
						cursor: 'pointer',
						width: props.width,
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={() => {}}>로그아웃</MenuItem>
			</Menu> */}
		</Box>
	);
};

export default Profile;
