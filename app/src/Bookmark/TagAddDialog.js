import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Icon, InputAdornment, InputLabel, MenuItem, TextField } from '@mui/material'
import StandardDialog from '../components/dialogs/StandardDialog'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../state/firebaseActions/bookmark-actions'
import WithDirectoryParentUUID from '../components/HOC/WithDirectoryParentUUID'
import { Cancel, Tag } from '@mui/icons-material'
import { v4 as uuid } from 'uuid'
import { Subtext } from '../components/styledComponents/BasicComponents'
import { Select } from '@material-ui/core'

const maxTagNameLength = 30
const defaultTagColor = "#3f62b5"
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

const StyledInputField = styled(TextField)`
	width: 100%;
	margin-bottom: 16px;
`
const StyledSelect = styled(Select)`
	width: 100%;
	margin-bottom: 16px;
`
export const TagsSelectedContainer = styled.div`
	width: 100%;
	max-height: 70px;
	display: flex;
	place-items: center;
	flex-wrap: nowrap;
	overflow-y: hidden;
	overflow-x: scroll;
`
const TagsAvailableContainer = styled(TagsSelectedContainer)`
	max-height: 110px;
	flex-wrap: wrap;
	overflow: scroll;
	padding: 8px;
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
export const TagItem = styled.div`
	display: flex;
	place-items: center;
	max-height: 48px;
	padding: 8px 16px;
	border-radius: 4px;
	background-color: ${({tagColor})=> tagColor ? `${tagColor}40` :  `${defaultTagColor}40`};
	color: ${({tagColor})=> tagColor ? tagColor : defaultTagColor};
	border: 1px solid ${({tagColor})=> tagColor ? tagColor : defaultTagColor};
	white-space: nowrap;
	div {
		white-space: nowrap;
		place-items: center;
		display: flex;
	}
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

function TagAddDialog (props) {
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
		setUnselectedTags([...unselectedTags, removedTag])
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

	const renderUnselectedTag = (tag) => {
		return (
			<TagItem 
				key={tag.uuid} 
				tagColor={tag.color} 
				style={{ marginRight: 8, marginBottom: 8, cursor: 'pointer' }}
				onClick={()=>onSelectAvailableTag(tag)}
			>
				<Icon style={{ marginRight: 8 }}>{tag.type.icon}</Icon>
				<div>{tag.name}</div>
				<Cancel 
					style={{ cursor: 'pointer', marginLeft: 8 }} 
					onClick={(e)=>{
						e.preventDefault()
						e.stopPropagation()
						onDeleteAvailable(tag)
					}}
				/>
			</TagItem>
		)
	}

	const renderSelectedTag = (tag) => {
		return (
			<TagItem key={tag.uuid} tagColor={tag.color} style={{ marginRight: 8, marginBottom: 8 }}>
				<Icon style={{ marginRight: 8 }}>{tag.type.icon}</Icon>
				<div>{tag.name}</div>
				<Cancel style={{ cursor: 'pointer', marginLeft: 8 }} onClick={()=>onRemoveSelected(tag)} />
			</TagItem>
		)
	}

	return (
		<StandardDialog
			open={visible}
			_setOpen={_setVisible}
			dialogTitle={"Tag Select"}
			dialogActions={[
				<Button onClick={onTagAddSubmit}>Update Tag List</Button>
			]}
		>
			<div>
				<div style={{ fontSize: 20, marginBottom: 16 }} >New Tag</div>
				<NewTagCreateContainer>
					<LeftSideTagCreate>
						<StyledInputField
							autoComplete='off'
							required
							label="Tag Name" 
							variant="outlined" 
							inputProps={{ maxLength: maxTagNameLength }}
							value={newTag.name} 
							onChange={(event) => updateInputValue({name: event.target.value})} />
						
						<StyledSelect
							labelId="Type"
							label={<InputLabel>Type</InputLabel>}
							value={newTag.type}
							onChange={(event)=>onTypeSelect(event.target.value)}
							variant="outlined"
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
						<StyledInputField 
							autoComplete='off'
							label="Hex color code" 
							variant="outlined" 
							value={hexColorInputValue} 
							onChange={(event) => onHexColorInputChange(event.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Tag />
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
						<TagItem tagColor={newTag.color}>
							<Icon style={{ marginRight: 8 }}>{newTag.type.icon}</Icon>
							{newTag.name || 'Placeholder'}
						</TagItem>
					</RightSideTagCreate>
				</NewTagCreateContainer>
				<Button 
					disabled={!newTag.name} 
					variant="outlined"
					style={{ margin: '16px 0', width: '100%' }}
					onClick={onTagCreate}
				>Add New Tag</Button>
			</div>
			<div>
				<div style={{ fontSize: 20 }} >Choose from existing tags</div>
				<TagsAvailableContainer>
					{
						unselectedTags.length > 0 
							? unselectedTags.reverse().map(renderUnselectedTag) 
							: <Subtext style={{ fontSize: '0.8em', fontStyle: 'italic' }}>No tags available.</Subtext>
					}
				</TagsAvailableContainer>
			</div>
			<SelectedTagsContainer>
				<div style={{ fontSize: 20 }} >Selected tags</div>
				<TagsSelectedContainer>
					{
						tagsToAdd.length > 0 
							? tagsToAdd.reverse().map(renderSelectedTag) 
							: <Subtext style={{ fontSize: '0.8em', fontStyle: 'italic' }}>No tags selected.</Subtext>
					}
				</TagsSelectedContainer>
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
)(TagAddDialog)