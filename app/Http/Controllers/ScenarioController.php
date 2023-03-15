<?php

namespace App\Http\Controllers;

use App\Models\Scenario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use File;

class ScenarioController extends Controller
{
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
     * @param  \App\Models\Scenario  $scenario
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Scenario $scenario)
    {
        $data = $request->all();
        return response()->json([
            'success' => true,
            'data' => $data
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
}
