<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Option;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $questions = Question::all();
        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->question, [
			'scenario_id' => 'required',
			'type' => 'required',
		]);

		if ($validator->fails()) {
			$errors = $validator->errors()->all();
			$message = '';
			if (in_array("validation.required", $errors)) {
					$message = "All values must be entered";
			}
			$response = [
				"message" => $message,
				"success" => false
			];
			return response($response, 422);
		}

        $question = $request->question;
        $options = $request->options;

        $question = Question::create($question);
        
        if(count($options) > 0){
            foreach ($options as $item) {
                Option::create([
                    'question_id' => $question->id, 
                    'content' => $item['content'], 
                    'next_question_id' => $item['next_question_id']
                ]); 
            }
        }


        return response()->json([
            'success' => true,
            'data' => $question
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question)
    {
        return response()->json([
            'success' => true,
            'data' => $question
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function destroy(Question $question)
    {
        if($question->type == 'option'){
            $question_id = $question->id;
            Option::where('question_id', $question_id)->delete();
            $question->delete();
        } else {
            $question->delete();
        }

        $questions = Question::all();

        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

        /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getQuestionsById(Request $request)
    {
        $questions = Question::where('scenario_id', $request->id)->get();
        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }
}
