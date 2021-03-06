import React, { useState } from 'react'
import styled from 'styled-components'
import TagEditDialog from './TagEditDialog'
import { Icon } from '@mui/material'
import TagListDisplay from './TagListDisplay'
import { ThemeButton } from '../../components/styledComponents/Buttons'

const TagSection = styled.div`
	border: 1px solid ${(props) => props.theme.themeColors.primaryContrastA};
	border-radius: 8px;
	padding: 16px;
	padding-top: 8px;
	margin-bottom: 16px;
`
const TagSectionHeader = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	place-items: center;
	cursor: pointer;
	button {
		width: 200px;
		display: flex;
		place-items: center;
	}
`

export default function BookmarkTagsEditor({tags, _updateTags}) {
	const [tagEditDialogVisible, setTagEditDialogVisible] = useState(false)

	return (
		<>
			<TagSection>
				<TagSectionHeader onClick={()=>setTagEditDialogVisible(true)}>
						<div style={{ fontSize: 20, width: '100%' }}>Tags</div>
						<ThemeButton
							variant="outlined"
							onClick={()=>setTagEditDialogVisible(true)}
						>
							<Icon style={{ marginRight: 8 }}>app_registration</Icon> Modify List
						</ThemeButton>
				</TagSectionHeader>
				<TagListDisplay tags={tags} />
			</TagSection>
			{
				tagEditDialogVisible && (
					<TagEditDialog
						visible={tagEditDialogVisible}
						_setVisible={setTagEditDialogVisible}
						tagsInBookmark={tags}
						_updateTagsInBookmark={_updateTags}
					/>
				)
			}
		</>
	)
}