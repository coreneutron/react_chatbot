<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use File;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $settings = Setting::all();
        return response()->json([
            'success' => true,
            'data' => $settings
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function show(Setting $setting)
    {
        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Setting $setting)
    {
        $data = $request->setting;
        $setting->update($data);

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    public function updateSettingBotAvatar(Request $request)
    {
        $id = $request->id;
        $data = $request->all();
        $setting = Setting::find($id);

        if($request->file){
            $file_path = public_path('avatar/'.$setting->value);
            if(File::exists($file_path)) {
                unlink($file_path);
            }

            $upload_path = public_path('avatar');
            $generated_name = '';
            $file_name = $request->file->getClientOriginalName();
            $generated_name = time() . '.' . $request->file->getClientOriginalExtension();
            $request->file->move($upload_path, $generated_name);
            $data['value'] = $generated_name;
        }
        
        $setting->update($data);

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
