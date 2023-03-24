<?php

namespace App\Http\Controllers;

use App\Models\Scenario;
use App\Models\Question;
use App\Models\Option;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use File;

class ScenarioController extends Controller
{
    public $story = [];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $scenarios = Scenario::all();
        return response()->json([
            'success' => true,
            'data' => $scenarios
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
        $validator = Validator::make($request->all(), [
			'title' => 'required|string',
			'message' => 'required|string',
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

        $data = $request->all();
        
        if($request->file){
            $upload_path = public_path('upload');
            $generated_name = '';
            $file_name = $request->file->getClientOriginalName();
            $generated_name = time() . '.' . $request->file->getClientOriginalExtension();
            $request->file->move($upload_path, $generated_name);
            $data['image'] = $generated_name;
        }
        
        $scenario = Scenario::create($data);

        return response()->json([
            'success' => true,
            'data' => $scenario
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Scenario  $scenario
     * @return \Illuminate\Http\Response
     */
    public function show(Scenario $scenario)
    {
        return response()->json([
            'success' => true,
            'data' => $scenario
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Scenario  $scenario
     * @return \Illuminate\Http\Response
     */
    public function edit(Scenario $scenario)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Scenario  $scenario
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Scenario $scenario)
    {
        $data = $request->all();
        $scenario->update($data);
        return response()->json([
            'success' => true,
            'data' => $scenario
        ]);
        // $data = $request->all();
        // dd($scenario);


        // if($request->file){
        //     $upload_path = public_path('upload');
        //     $generated_name = '';
        //     $file_name = $request->file->getClientOriginalName();
        //     $generated_name = time() . '.' . $request->file->getClientOriginalExtension();
        //     $request->file->move($upload_path, $generated_name);
        //     $data['image'] = $generated_name;
        // }

        // $scenario->update($data);
        // return response()->json([
        //     'success' => true,
        //     'data' => $scenario
        // ]);
    }

    public function updateScenario(Request $request)
    {
        $id = $request->id;
        $data = $request->all();
        $scenario = Scenario::find($id);

        if($request->file){
            $file_path = public_path('upload/'.$scenario->image);
            if(File::exists($file_path)) {
                unlink($file_path);
            }

            $upload_path = public_path('upload');
            $generated_name = '';
            $file_name = $request->file->getClientOriginalName();
            $generated_name = time() . '.' . $request->file->getClientOriginalExtension();
            $request->file->move($upload_path, $generated_name);
            $data['image'] = $generated_name;
        }
        
        $scenario->update($data);

        return response()->json([
            'success' => true,
            'data' => $scenario
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function updateScenarioStatus(Request $request)
    {  
        $id = $request->id;
        $status = $request->status;
        Scenario::query()->update(['status' => 0]);
        
        $scenario = Scenario::find($id);
        $scenario->status = 1;
        $scenario->save();

        $scenarios = Scenario::all();
        return response()->json([
            'success' => true,
            'data' => $scenarios
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Scenario  $scenario
     * @return \Illuminate\Http\Response
     */
    public function destroy(Scenario $scenario)
    {
        //
        $scenario->delete();
        $scenarios = Scenario::all();

        return response()->json([
            'success' => true,
            'data' => $scenarios
        ]);
    }

    /**
     * Get the story resource from storage.
     */
    public function getStory()
    {
        $scenario = Scenario::where('status', 1)->first();
        if(isset($scenario['question_id']) && $scenario['question_id'] != 0){
            array_push($this->story, array('id'=> $scenario['title'], 'message'=> $scenario['message'], 'trigger'=>$scenario['question_id']));
            $question = Question::where('id', $scenario['question_id'])->first();
            if(isset($question['next_question_id'])){
                $this->makeQuestionJson($question['id']);
            } 
            else {
                if($question['type'] == 'text')
                    array_push($this->story, array('id'=> $question['id'], 'message'=> $question['content']));
                if($question['type'] == 'option')
                    $this->makeOptionJson($question);
                if($question['type'] == 'input')
                    array_push($this->story, array('id'=> $question['id'], 'user'=> true));
            }
        } else {
            if(isset($scenario['title']) && isset($scenario['message'])){
                array_push($this->story, array('id'=> $scenario['title'], 'message'=> $scenario['message']));
            }
        }

        return response()->json([ 'success' => true,  'data' => $this->story ]);
    }

    public function makeQuestionJson($id){
        $dupFlg = false;
        foreach($this->story as $item){
            if($id == $item['id'])
                $dupFlg = true;
        }
        if($dupFlg)
            return ;

        $data = Question::where('id', $id)->first();
        
        if(!is_null($data['next_question_id'])){
            if($data['type'] == 'text'){
                array_push($this->story, array('id'=> $data['id'], 'message'=> $data['content'], 'trigger'=>$data['next_question_id']));
                return $this->makeQuestionJson($data['next_question_id']);
            }
            if($data['type'] == 'input'){
                array_push($this->story, array('id'=> $data['id'], 'user'=> true, 'trigger'=>$data['next_question_id']));
                return $this->makeQuestionJson($data['next_question_id']);
            }
        } 
        else {
            if($data['type'] == 'text')
                array_push($this->story, array('id'=> $data['id'], 'message'=> $data['content']));
            if($data['type'] == 'option'){
                // $dupFlg = false;
                // foreach($this->story as $item){
                //     if($item['id'] == $data['id'])
                //         $dupFlg = true;
                // }
                // if(!$dupFlg)
                //     return $this->makeOptionJson($data);
                // else 
                //     return ;

                return $this->makeOptionJson($data);
            }
            if($data['type'] == 'input')
                array_push($this->story, array('id'=> $data['id'], 'user'=> true));
        }
    }
    public function makeOptionJson($question){
        $options = [];
        $data = Option::where('question_id', $question['id'])->get();
        foreach($data as $index=>$item){
            if(isset($item['next_question_id'])) {
                array_push($options, array('value'=> $index, 'label'=> $item['content'], 'trigger'=>$item['next_question_id']));
                $this->makeQuestionJson($item['next_question_id']);
            } else {
                array_push($options, array('value'=> $index, 'label'=> $item['content']));
            }
        }
        array_push($this->story, array('id'=> $question['id'], 'options'=> $options));
    }
}
