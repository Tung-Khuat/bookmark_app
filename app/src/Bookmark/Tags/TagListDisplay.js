import React from 'react'
import styled from 'styled-components'
import { Subtext } from '../../components/styledComponents/BasicComponents'
import { Icon } from '@mui/material'
import { Cancel } from '@mui/icons-material'

const defaultTagColor = "#3f62b5"

const TagsDisplayContainer = styled.div`
	margin-bottom: 8px;
`
const TagListHeader = styled.div`
	font-size: 20px;
`
const TagListContainer = styled.div`
	margin: 8px 0;
	width: 100%;
	max-height: 70px;
	display: flex;
	place-items: center;
	flex-wrap: nowrap;
	overflow-y: hidden;
	overflow-x: scroll;
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

export default function TagListDisplay({tags, listHeader, emptyStateText, _onTagClick, _onTagDeleteClick}) {
	const renderTag = (tag, index) => {
		return (
			<TagItem 
				key={index}
				tagColor={tag.color} 
				style={{ marginRight: 8, marginBottom: 8, cursor: _onTagClick ? 'pointer' : 'default' }}
				onClick={()=>_onTagClick && _onTagClick(tag)}
			>
				<Icon style={{ marginRight: 8 }}>{tag.type.icon}</Icon>
				<div>{tag.name}</div>
				{
					_onTagDeleteClick && (
						<Cancel 
							style={{ cursor: 'pointer', marginLeft: 8 }} 
							onClick={(e)=>{
								e.preventDefault()
								e.stopPropagation()
								_onTagDeleteClick && _onTagDeleteClick(tag)
							}}
						/>
					)
				}
			</TagItem>
		)
	}

	return (
		<TagsDisplayContainer>
			{
				listHeader && (
					<TagListHeader>
						{listHeader}
					</TagListHeader>
				)
			}
			<TagListContainer>
				{
					tags && tags.length > 0 
						? tags.map(renderTag) 
						: <Subtext style={{ fontSize: '0.8em', fontStyle: 'italic' }}>{emptyStateText || 'No tags in this list.'}</Subtext>
				}
			</TagListContainer>
		</TagsDisplayContainer>
	)
}