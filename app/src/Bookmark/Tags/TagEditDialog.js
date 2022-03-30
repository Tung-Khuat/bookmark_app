import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FormControl, Icon, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material'
import StandardDialog from '../../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../../state/firebaseActions/bookmark-actions'
import WithDirectoryParentUUID from '../../components/HOC/WithDirectoryParentUUID'
import { v4 as uuid } from 'uuid'
import StandardInputField from '../../components/inputs/StandardInputField'
import TagListDisplay, { TagItem, TagItemWhiteBackgroundContainer } from './TagListDisplay'
import { ThemeButton } from '../../components/styledComponents/Buttons'
import { ThemeIcon } from '../../components/styledComponents/Icons'

const maxTagNameLength = 30
const presetColors = ["#3f62b5", "#579a4a", "#a72c4e", "#ff951b", "#292929"]
const tagTypes = [
	{
		name: "Other",
		icon: "local_offer",
	},
	{
		name: "Author",
		icon: "person",
	},
	{
		name: "Rating",
		icon: "star",
	},
	{
		name: "Category",
		icon: "category",
	},
	{
		name: "Site",
		icon: "language",
	},
	{
		name: "Genre",
		icon: "movie",
	},
]

const StyledSelect = styled(Select)`
	width: 100%;
	margin-bottom: 16px;
`
const NewTagCreateContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	place-items: center;
`
const LeftSideTagCreate = styled.div`
	width: 100%;
`
const RightSideTagCreate = styled.div`
	display: grid;
	grid-template-rows: 1fr 1fr;
	place-items: center;
`
const ColorButton = styled.div`
	border-radius: 50%;
	width: 28px;
	height: 28px;
	margin: 0 4px;
    cursor: pointer;
	background-color: ${({color})=> color};
`
const SelectedTagsContainer = styled.div`
    background: #e0e2ff5e;
    padding: 24px;
    border-radius: 4px;
	margin: 16px 0;
`
const initialNewTagState =  {
	name: "",
	color: "",
	type: tagTypes[0],
}

function TagEditDialog (props) {
	const { visible, tagsInBookmark, bookmarks, _setVisible, _updateTagsInBookmark  } = props
	const [newTag, setNewTag] = useState(initialNewTagState)
	const [tagsToAdd, setTagsToAdd] = useState([])
	const [hexColorInputValue, setHexColorInputValue] = useState("")
	const [unselectedTags, setUnselectedTags] = useState([])

	useEffect(()=>{
		if(bookmarks && bookmarks.length > 0){
			const availableTags = []
			bookmarks.forEach((bookmark) => {
				bookmark.tags.forEach((tag) => {
					const matching = availableTags.find(t => t.uuid === tag.uuid)
					if(!matching) {
						availableTags.push(tag)
					}
				})
			})
			const filtered = availableTags?.length > 0 && availableTags.filter((t) => {
				return !tagsInBookmark.some((tagInBookmark)=>t.uuid === tagInBookmark.uuid)
			})
			setUnselectedTags(filtered)
		}
	},[bookmarks, tagsInBookmark])

	useEffect(()=>{
		if(tagsInBookmark && tagsInBookmark.length > 0){
			setTagsToAdd(tagsInBookmark)
		}
	},[tagsInBookmark])

	const updateInputValue = (value) => {
		setNewTag({...newTag, ...value})
	}

	const onTagCreate = () => {
		const newTagWithUUID = {
			...newTag,
			uuid: uuid()
		}
		setTagsToAdd([...tagsToAdd, newTagWithUUID])
	}

	const onDeleteAvailable = (deletedTag) => {
		const updatedUnselectedTags = unselectedTags.filter((tag) => tag.uuid !== deletedTag.uuid)
		setUnselectedTags(updatedUnselectedTags)
	}

	const onTagAddSubmit = () => {
		_updateTagsInBookmark(tagsToAdd)
		_setVisible(false)
	}

	const onSelectAvailableTag = (selectedTag) => {
		const updatedUnselectedTags = unselectedTags.filter((tag) => tag.uuid !== selectedTag.uuid)
		setTagsToAdd([...tagsToAdd, selectedTag])
		setUnselectedTags(updatedUnselectedTags)
	}

	const onRemoveSelected = (removedTag) => {
		const updatedTagsToAdd = [...tagsToAdd].filter(tag => tag.uuid !== removedTag.uuid)
		setTagsToAdd(updatedTagsToAdd)
		setUnselectedTags([removedTag, ...unselectedTags])
	}

	const onTypeSelect = (typeSelected) => {
		updateInputValue({type: typeSelected})
	}

	const onHexColorInputChange = (value) => {
		let formattedValue = value
		if(value.charAt(0) === '#'){
			formattedValue = formattedValue.substring(1)
		}
		if(formattedValue.length < 7) {
			setHexColorInputValue(formattedValue)
		}
		if(formattedValue.length === 6) {
			updateInputValue({color: `#${formattedValue}`})
		}
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle={"Tag Select"}
			dialogActions={[
				<ThemeButton onClick={onTagAddSubmit}>Update Tag List</ThemeButton>
			]}
		>
			<div>
				<div style={{ fontSize: 20, marginBottom: 16 }} >New Tag</div>
				<NewTagCreateContainer>
					<LeftSideTagCreate>
						<StandardInputField
							required
							label="Tag Name" 
							inputProps={{ maxLength: maxTagNameLength, style: { height: 40 } }}
							value={newTag.name} 
							onChange={(event) => updateInputValue({name: event.target.value})} 
						/>
						
						<FormControl fullWidth>
							<InputLabel id="tag-type">Type</InputLabel>
							<StyledSelect
								id="tag-select"
								labelId="tag-type"
								label="Type"
								value={newTag.type}
								onChange={(event)=>onTypeSelect(event.target.value)}
								style={{ width: '100%' }}
								SelectDisplayProps={{ style: { display: 'flex', placeItems:'center' } }}
							>
								{
									tagTypes.map((type, index)=>(
										<MenuItem 
											key={index} 
											value={type} 
											style={{ display: 'flex', placeItems: 'center', padding: '16px' }}
										>
											<Icon style={{ marginRight: 8 }}>{type.icon}</Icon> {type.name}
										</MenuItem>
									))
								}
							</StyledSelect>
						</FormControl>
					
						<StandardInputField 
							label="Hex color code" 
							value={hexColorInputValue} 
							onChange={(event) => onHexColorInputChange(event.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<ThemeIcon >tag</ThemeIcon>
									</InputAdornment>
								),
							}} 
						/>
						
						<div style={{ display: 'flex' }}>
							{
								presetColors.map((color, index) => (
									<ColorButton key={index} color={color} onClick={()=>onHexColorInputChange(color)} />
								))
							}
						</div>
					</LeftSideTagCreate>
					<RightSideTagCreate>
						<TagItemWhiteBackgroundContainer>
							<TagItem tagColor={newTag.color}>
								<Icon style={{ marginRight: 8 }}>{newTag.type.icon}</Icon>
								{newTag.name || 'Placeholder'}
							</TagItem>
						</TagItemWhiteBackgroundContainer>
					</RightSideTagCreate>
				</NewTagCreateContainer>
				
				<ThemeButton 
					disabled={!newTag.name} 
					variant="outlined"
					style={{ margin: '16px 0', width: '100%' }}
					onClick={onTagCreate}
				>Add New Tag</ThemeButton>
			</div>
			<TagListDisplay 
				tags={unselectedTags} 
				listHeader={"Choose from existing tags"} 
				emptyStateText={"No tags available."}
				_onTagClick={(tag) => onSelectAvailableTag(tag)}
				_onTagDeleteClick={(tag) => onDeleteAvailable(tag)} 
			/>
			<SelectedTagsContainer>
				<TagListDisplay 
					tags={tagsToAdd} 
					listHeader={"Selected Tags"} 
					_onTagDeleteClick={(tag)=>onRemoveSelected(tag)} 
				/>
			</SelectedTagsContainer>
		</StandardDialog>
	)
}

const mapState = ({
	firestoreReducer: { ordered: { bookmarks } }
}) => ({
	bookmarks
})

const mapDispatchToProps = (dispatch) => ({
	_createBookmark: bindActionCreators(bookmarkActions._createBookmark, dispatch),
	_updateBookmark: bindActionCreators(bookmarkActions._updateBookmark, dispatch),
	_upload: bindActionCreators(bookmarkActions._upload, dispatch),
})

export default compose(
	WithDirectoryParentUUID,
	connect(mapState, mapDispatchToProps)
)(TagEditDialog)