class Api::V1::ReplayableAnswersController < ApplicationController
  before_action :set_replayable_answer, only: [:show]
  
  def index
    @replayable_answers = ReplayableAnswer.includes(:question).all
    render json: @replayable_answers.map do |answer|
      {
        id: answer.id,
        uuid: answer.uuid,
        username: answer.username,
        question: answer.question&.content || 'Question not found',
        created_at: answer.created_at
      }
    end
  end
  
  def show
    render json: {
      id: @replayable_answer.id,
      uuid: @replayable_answer.uuid,
      username: @replayable_answer.username,
      question: @replayable_answer.question&.content || 'Question not found',
      recording_data: @replayable_answer.recording_data,
      created_at: @replayable_answer.created_at
    }
  end
  
  def create
    @replayable_answer = ReplayableAnswer.new(replayable_answer_params)
    
    if @replayable_answer.save
      render json: {
        id: @replayable_answer.id,
        uuid: @replayable_answer.uuid,
        username: @replayable_answer.username,
        question: @replayable_answer.question.content
      }, status: :created
    else
      render json: @replayable_answer.errors, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_replayable_answer
    @replayable_answer = ReplayableAnswer.find_by(uuid: params[:id]) || ReplayableAnswer.find(params[:id])
  end
  
  def replayable_answer_params
    params.require(:replayable_answer).permit(:username, :question_id, recording_data: [:type, :key, :timestamp, :value])
  end
end