class CreateReplayableAnswers < ActiveRecord::Migration[7.0]
  def change
    create_table :replayable_answers do |t|
      t.string :username, null: false
      t.string :uuid, null: false
      t.references :question, null: false, foreign_key: true
      t.json :recording_data, null: false
      t.timestamps
    end
    
    add_index :replayable_answers, :uuid, unique: true
  end
end