<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TransactionStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'transactor' => 'required|string|max:255', // Maintenu pour compatibilité, représente le nom du donateur
            'communication' => 'nullable|string|max:255',
            'fund_id' => 'required|exists:funds,id',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            // Les champs month et year sont extraits de la date
        ];
    }
}
