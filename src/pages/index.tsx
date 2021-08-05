import React, { useEffect, useState } from 'react';
import {Layout, SectionTitle} from "../components/Common";
import Loading from '../components/Common/Loading/Loading';
import {ProfileSelector} from "../components/Home";
import RuleItem from '../components/Home/RuleList/RuleItem/RuleItem';
import RoomSelector from '../components/RoomSelector';
import { useSocket } from '../hooks';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Index(): JSX.Element {
	const socket = useSocket();
	const [isLoading, setIsLoading] = useState(true);
	const [username, setUsername] = useState<string>("");
	const [profileIsComplete, setProfileIsComplete] = useState<boolean>(false);
	const [profileStorage, setProfileStorage] = useLocalStorage("profile")

	useEffect(() => {
		if(socket) {
			setIsLoading(false)
			if(profileStorage) {
				// TODO: Redirect to correct room.
			}
		}
	}, [socket, profileStorage]);

	const handleStart = () => {
		// TODO: Get profile from ProfileSelector
		const profile = {
			username,
			hat: 1,
			body: 1,
			lead: 1,
		}
		
		socket.emit("update-profile", profile, () => {
			setProfileIsComplete(true);
			setProfileStorage(profile);
		})
	}

	const handleDisconnect = () => {
		setProfileIsComplete(false);
	}

	const handleRoomCreation = () => {
		socket.emit('create-room');
	}

	return (
		<div>
			{
			isLoading
			? (
				<Loading/>
			) 
			: (
				!profileIsComplete
				? (
					<Layout>
						<div className="flex flex-wrap flex-auto justify-center md:space-x-32">
							<div>
								<SectionTitle hintColor="text-pink-dark-pink">THE GAME</SectionTitle>
								<RuleItem id={1} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
								<RuleItem id={2} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
								<RuleItem id={3} title="Invite tes copaing" content="Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet... Lorem Ipsum Dolor sit amet..."/>
							</div>
							<div >
								<ProfileSelector 
								handleStart={handleStart}
								handleUserName={(e) => setUsername(e.currentTarget.value)}
								username={username}/>
							</div>
						</div>
					</Layout>
				)
			: (
				<RoomSelector
					socket={socket}
					onHandleRoomCreation={handleRoomCreation}
					onHandleDisconnect={handleDisconnect}
				/>
				)
			)
			}
		</div>
	);
}