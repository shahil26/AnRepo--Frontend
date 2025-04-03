import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	DecoupledEditor,
	Alignment,
	AutoImage,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockQuote,
	Bold,
	Bookmark,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
	Code,
	CodeBlock,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	Highlight,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	ListProperties,
	PageBreak,
	Paragraph,
	PictureEditing,
	RemoveFormat,
	SpecialCharacters,
	Strikethrough,
	Style,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TodoList,
	Underline
} from 'ckeditor5';
import { ExportPdf, ExportWord, ImportWord, MultiLevelList, Pagination } from 'ckeditor5-premium-features';
import io from "socket.io-client";
import 'ckeditor5/ckeditor5.css';
import ChartDisplay from './ChartDisplay';
import WorkManager from '../components/dashboard/overviewComponents/WorkManager';
//import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useParams } from 'react-router';
import ListWithSelectedItem from "./List";
import AutoCreate from "./AutoCreate";

const SAVE_INTERVAL_MS = 2000;

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzQ5OTgzOTksImp0aSI6IjZlNTRkOWE5LTExNmEtNDliMy1hZTMyLWY2NGQ1Mzc1NTQ0MCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjMwMTU5YjU3In0.BO0Jstw0o4UJeHSBSYoBLbvwNvWQgEM1zsVyL2ZbRWhbAWl6aLuTHg5Y9Xk4QLfRlIUXRSrLqVw7Lmu5mWZJjQ';

const CLOUD_SERVICES_TOKEN_URL =
	'https://wm6ql9t22ry8.cke-cs.com/token/dev/b02dd924d96052bd16f3ff9e9223c47ec6f5988772b7960cd7cd1c8879f5?limit=10';

export default function App() {
	const editorContainerRef = useRef(null);
	const editorMenuBarRef = useRef(null);
	const editorToolbarRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const { id } = useParams();



	/* backend code start */

	
	const [socket, setSocket] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const s = io("http://localhost:3001"); // Replace with your server URL
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

	

  // Load document from backend using the ID from the URL
  useEffect(() => {
    if (!socket || !editorInstance || !id) return;

    socket.once("load-document", (document) => {
      if (document) {
        editorInstance.setData(document);
				
      } else {
        console.warn("Document not found on backend.");
      }
    });

    socket.emit("get-document", id);
  }, [socket, editorInstance, id]);

	

  // Save document to backend periodically
  useEffect(() => {
    if (!socket || !editorInstance || !id) return;

    const interval = setInterval(() => {
      const data = editorInstance.getData();
      socket.emit("save-document", { id, data }); // Send document ID and content
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, editorInstance, id]);

  // Handle real-time updates from other clients
  useEffect(() => {
    if (!socket || !editorInstance) return;

    const handleChanges = (newData) => {
      editorInstance.setData(newData);
    };

    socket.on("receive-changes", handleChanges);

    return () => socket.off("receive-changes", handleChanges);
  }, [socket, editorInstance]);

  // Send real-time updates to other clients when data changes
  useEffect(() => {
    if (!socket || !editorInstance) return;

    const onChange = () => {
      const data = editorInstance.getData();
      socket.emit("send-changes", { id, data }); // Send document ID and updated content
    };

    editorInstance?.editing.view.document.on("change:data", onChange);

    return () => editorInstance?.editing.view.document.off("change:data", onChange);
  }, [socket, editorInstance, id]);


	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

 
  

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
						'previousPage',
						'nextPage',
						'|',
						'heading',
						'style',
						'|',
						'fontSize',
						'fontFamily',
						'fontColor',
						'fontBackgroundColor',
						'|',
						'bold',
						'italic',
						'underline',
						'|',
						'link',
						'insertImage',
						'insertTable',
						'highlight',
						'blockQuote',
						'codeBlock',
						'|',
						'alignment',
						'|',
						'bulletedList',
						'numberedList',
						'multiLevelList',
						'todoList',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Alignment,
					AutoImage,
					AutoLink,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					Bold,
					Bookmark,
					CKBox,
					CKBoxImageEdit,
					CloudServices,
					Code,
					CodeBlock,
					Essentials,
					ExportPdf,
					ExportWord,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					GeneralHtmlSupport,
					Heading,
					Highlight,
					HorizontalLine,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsert,
					ImageInsertViaUrl,
					ImageResize,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					ImportWord,
					Indent,
					IndentBlock,
					Italic,
					Link,
					List,
					ListProperties,
					MultiLevelList,
					PageBreak,
					Pagination,
					Paragraph,
					PictureEditing,
					RemoveFormat,
					SpecialCharacters,
					Strikethrough,
					Style,
					Subscript,
					Superscript,
					Table,
					TableCaption,
					TableCellProperties,
					TableColumnResize,
					TableProperties,
					TableToolbar,
					TodoList,
					Underline
				],
				balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
				cloudServices: {
					tokenUrl: CLOUD_SERVICES_TOKEN_URL
				},
				exportPdf: {
					stylesheets: [
						/* This path should point to application stylesheets. */
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
						/*'./App.css',
						/* Export PDF needs access to stylesheets that style the content. */
						'https://cdn.ckeditor.com/ckeditor5/44.0.0/ckeditor5.css',
						'https://cdn.ckeditor.com/ckeditor5-premium-features/44.0.0/ckeditor5-premium-features.css'
					],
					fileName: 'export-pdf-demo.pdf',
					converterOptions: {
						format: 'A4',
						margin_top: '20mm',
						margin_bottom: '20mm',
						margin_right: '12mm',
						margin_left: '12mm',
						page_orientation: 'portrait'
					}
				},
				exportWord: {
					stylesheets: [
						/* This path should point to application stylesheets. */
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-word.html */
						/*'./App.css',
						/* Export Word needs access to stylesheets that style the content. */
						'https://cdn.ckeditor.com/ckeditor5/44.0.0/ckeditor5.css',
						'https://cdn.ckeditor.com/ckeditor5-premium-features/44.0.0/ckeditor5-premium-features.css'
					],
					fileName: 'export-word-demo.docx',
					converterOptions: {
						document: {
							orientation: 'portrait',
							size: 'A4',
							margins: {
								top: '20mm',
								bottom: '20mm',
								right: '12mm',
								left: '12mm'
							}
						}
					}
				},
				fontFamily: {
					supportAllValues: true
				},
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				heading: {
					options: [
						{
							model: 'paragraph',
							title: 'Paragraph',
							class: 'ck-heading_paragraph'
						},
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1',
							class: 'ck-heading_heading1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2',
							class: 'ck-heading_heading2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3',
							class: 'ck-heading_heading3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4',
							class: 'ck-heading_heading4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5',
							class: 'ck-heading_heading5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6',
							class: 'ck-heading_heading6'
						}
					]
				},
				htmlSupport: {
					allow: [
						{
							name: /^.*$/,
							styles: true,
							attributes: true,
							classes: true
						}
					]
				},
				image: {
					toolbar: [
						'toggleImageCaption',
						'imageTextAlternative',
						'|',
						'imageStyle:inline',
						'imageStyle:wrapText',
						'imageStyle:breakText',
						'|',
						'resizeImage',
						'|',
						'ckboxImageEdit'
					]
				},
				initialData:
					'',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				list: {
					properties: {
						styles: true,
						startIndex: true,
						reversed: true
					}
				},
				menuBar: {
					isVisible: true
				},
				pagination: {
					pageWidth: '21cm',
					pageHeight: '29.7cm',
					pageMargins: {
						top: '20mm',
						bottom: '20mm',
						right: '12mm',
						left: '12mm'
					}
				},
				style: {
					definitions: [
						{
							name: 'Article category',
							element: 'h3',
							classes: ['category']
						},
						{
							name: 'Title',
							element: 'h2',
							classes: ['document-title']
						},
						{
							name: 'Subtitle',
							element: 'h3',
							classes: ['document-subtitle']
						},
						{
							name: 'Info box',
							element: 'p',
							classes: ['info-box']
						},
						{
							name: 'Side quote',
							element: 'blockquote',
							classes: ['side-quote']
						},
						{
							name: 'Marker',
							element: 'span',
							classes: ['marker']
						},
						{
							name: 'Spoiler',
							element: 'span',
							classes: ['spoiler']
						},
						{
							name: 'Code (dark)',
							element: 'pre',
							classes: ['fancy-code', 'fancy-code-dark']
						},
						{
							name: 'Code (bright)',
							element: 'pre',
							classes: ['fancy-code', 'fancy-code-bright']
						}
					]
				},
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				}
			}
		};
	}, [isLayoutReady]);

	useEffect(() => {
		if (editorConfig) {
			configUpdateAlert(editorConfig);
		}
	}, [editorConfig]);

	return <>
    <div className='flex h-screen'>
       <ChartDisplay/>
		<div className="main-container w-[50vw] ">
			<div
				className="editor-container editor-container_document-editor editor-container_include-pagination editor-container_include-style"
				ref={editorContainerRef}
			>
				<div className="editor-container__menu-bar  " ref={editorMenuBarRef}></div>
				<div className="editor-container__toolbar" ref={editorToolbarRef}></div>
				<div className="editor-container__editor-wrapper">
					<div className="editor-container__editor">
						<div ref={editorRef}>
							{editorConfig && (
								<CKEditor
								onReady={(editor) => {
									setEditorInstance(editor);

									// Attach the toolbar to a custom DOM element
									editorToolbarRef.current.appendChild(editor.ui.view.toolbar.element);
										editorMenuBarRef.current.appendChild(editor.ui.view.menuBarView.element);
								
							}}
							onChange={(event, editor) => {
									const data = editor.getData();
									if (socket) {
											socket.emit("send-changes", data);
									}
							}}
									onAfterDestroy={() => {
										Array.from(editorToolbarRef.current.children).forEach(child => child.remove());
										Array.from(editorMenuBarRef.current.children).forEach(child => child.remove());
									}}
									editor={DecoupledEditor}
									config={editorConfig}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
    <div>
    <WorkManager/>
		</div>
    </div>
		<AutoCreate editorInstance={editorInstance}/>
		</>
	
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
	if (configUpdateAlert.configUpdateAlertShown) {
		return;
	}

	const isModifiedByUser = (currentValue, forbiddenValue) => {
		if (currentValue === forbiddenValue) {
			return false;
		}

		if (currentValue === undefined) {
			return false;
		}

		return true;
	};

	const valuesToUpdate = [];

	configUpdateAlert.configUpdateAlertShown = true;

	if (!isModifiedByUser(config.licenseKey, '<YOUR_LICENSE_KEY>')) {
		valuesToUpdate.push('LICENSE_KEY');
	}

	if (!isModifiedByUser(config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>')) {
		valuesToUpdate.push('CLOUD_SERVICES_TOKEN_URL');
	}

	if (valuesToUpdate.length) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'to receive full access to Premium Features:',
				'',
				...valuesToUpdate.map(value => ` - ${value}`)
			].join('\n')
		);
	}
}
