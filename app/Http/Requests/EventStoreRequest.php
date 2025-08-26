<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'platform' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|string|url|max:2048',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'participants' => 'sometimes|array',
            'participants.*' => 'exists:users,id'
        ];
    }
}
