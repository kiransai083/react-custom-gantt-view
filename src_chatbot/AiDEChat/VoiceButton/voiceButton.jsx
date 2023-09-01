import React, { Component } from 'react';
import axios from 'axios';
import { FaMicrophone, FaStop } from "react-icons/fa";
import { ImSpinner8 } from 'react-icons/im'
import { performSpeechToText } from '../apiService';
import MicIcon from '../../assets/images/mic.png';

import './styles.scss';

export class VoiceButton extends Component {

    constructor(props) {
        // if (props.transcriptionURL === undefined) {
        //     throw new Error('Transcription URL is empty')
        // }
        super(props)
        this.state = {
            isRecording: false,
            isSpinning: false,
            showChatLoading: false
        }
        this.micRef = React.createRef(null)
        this.audioChunksRef = React.createRef([])
        this.audioChunks = React.createRef(false)
        this.intervalId = null

        this.handleStart = this.handleStart.bind(this)
        this.handleStop = this.handleStop.bind(this)
        this.startRecording = this.startRecording.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.sendDataToBackend = this.sendDataToBackend.bind(this)

        this.micIconColor = props.micColor || '#3d3d3d'
        this.stopIconColor = props.stopColor || '#3d3d3d'
    }

    handleStart() {
        this.setState({
            isRecording: true
        })
        this.startRecording()
    };

    handleStop() {

        this.setState({
            isRecording: false,
            isSpinning: false
        });
        this.stopRecording();
        console.log('stopping:', this.state.isRecording)
    };

    startRecording() {
        const mediaConstraints = { audio: true };

        navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    this.audioChunksRef.current.push(event.data);
                }
            });


            this.intervalId = setInterval(() => {
                this.micRef.current.stop();
            }, 8000)

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.audioChunksRef.current, { type: 'audio/wav' });
                this.sendDataToBackend(audioBlob);
                this.audioChunksRef.current = [];

                if (this.audioChunks) {
                    this.setState({
                        isRecording: true
                    })
                }

                if (this.audioChunks.current) {
                    this.micRef.current.start();
                }
                if (!this.audioChunks.current) {
                    clearInterval(this.intervalId)
                }
            });

            this.micRef.current = mediaRecorder;
            this.audioChunksRef.current = [];
            mediaRecorder.start();
            this.setState({
                isRecording: true
            })
            this.audioChunks.current = true

        });
    };

    stopRecording() {
        this.audioChunks.current = false
        if (this.micRef.current && this.micRef.current.state !== 'inactive') {
            this.micRef.current.stop();
        }

        this.setState({
            isRecording: false,
            isSpinning: false
        });
    };

    sendDataToBackend(audioBlob) {
        let mic_conv = []
        this.setState(prevState => ({
            ...prevState,
            isSpinning: true
        }))
        const headers = {
            "content-type": "multipart/form-data",
        };
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        performSpeechToText(formData, { headers }).then((res) => {
            console.log(res.data, this.isSpinning)
            if (res.data !== '') {
                let result = res.data
                mic_conv.push({
                    "from": "USER",
                    "text": result.trim()
                });
                this.props.setConversationText(mic_conv)
                this.setState(prevState => ({
                    ...prevState,
                    isSpinning: false,
                    isRecording: false
                }))
            }
            else {
                mic_conv = []
                this.stopRecording()
                this.setState(prevState => ({
                    ...prevState,
                    isSpinning: false,
                    isRecording: false
                }))
            }
        }).catch((e) => {
            console.log("Speech API Error: ", e);
            this.stopRecording()
            this.setState(prevState => ({
                ...prevState,
                isSpinning: false,
                isRecording: false
            }));
            this.props.handleVoiceAPIError();
        })
    };


    render() {
        return (
            <div className='speech2text'>
                <div className='mic-icon'>
                    {!this.state.isRecording
                        ? (<img src={MicIcon} height="21" onClick={this.handleStart} />)
                        : (
                            <div className="stop-loading">
                                {this.state.isSpinning ? <div class="lds-ripple"><div></div><div></div></div> :
                                    <FaStop size={'1.2rem'} onClick={this.handleStop} style={{}} className='stop-button'></FaStop>}
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

}
